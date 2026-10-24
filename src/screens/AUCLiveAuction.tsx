import React, { useState, useEffect, useCallback } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { wsService } from '../api/websocket';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, Btn, Card } from '../components/ui';
import type { Bid, Bidder } from '../api/types';

const initialVehicles = [
  { reg: 'TS09EA1234', make: 'Honda Activa 6G', reserve: '1,25,000', current: '1,85,000' },
  { reg: 'TS05MK3456', make: 'Tata Ace Gold', reserve: '3,50,000', current: '3,50,000' },
  { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', reserve: '2,80,000', current: '2,80,000' },
];

const initialBidders: Bidder[] = [
  { id: 'b-1', bidderId: 'BID-0247', name: 'A.K. Traders', companyName: 'A.K. Traders Pvt Ltd',
    email: 'contact@aktraders.com', phone: '+91 90000 10001', pan: 'AKTPS1234A',
    address: 'Shop No. 5, Market Road, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-15',
    emdBalance: 10000, emdDeposited: 10000, isActive: true, registeredAt: '2025-08-01T00:00:00Z',
  },
  { id: 'b-2', bidderId: 'BID-0133', name: 'Reddy Auto Works', companyName: 'Reddy Auto Works',
    email: 'info@reddyauto.com', phone: '+91 90000 10002', pan: 'REDPS5678B',
    address: '12, Industrial Area, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-10',
    emdBalance: 15000, emdDeposited: 15000, isActive: true, registeredAt: '2025-07-20T00:00:00Z',
  },
  { id: 'b-3', bidderId: 'BID-0089', name: 'Sri Balaji Motors', companyName: 'Sri Balaji Motors',
    email: 'balaji@motors.com', phone: '+91 90000 10003', pan: 'SBMPS9012C',
    address: '8-9-10, Secunderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-05',
    emdBalance: 8000, emdDeposited: 8000, isActive: false, registeredAt: '2025-07-25T00:00:00Z',
  },
  { id: 'b-4', bidderId: 'BID-0312', name: 'Hyderabad Scrap Ltd.', companyName: 'Hyderabad Scrap Ltd.',
    email: 'scrap@hydscrap.com', phone: '+91 90000 10004', pan: 'HSLPS3456D',
    address: 'Industrial Estate, Hyderabad', kycStatus: 'Verified', kycVerifiedAt: '2025-08-12',
    emdBalance: 12000, emdDeposited: 12000, isActive: false, registeredAt: '2025-08-01T00:00:00Z',
  },
];

export default function AUCLiveAuction() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [currentBid, setCurrentBid] = useState(185000);
  const [timeLeft, setTimeLeft] = useState(1847);
  const [pulse, setPulse] = useState(false);
  const [feed, setFeed] = useState<any[]>([
    { bidder: 'BID-0247', amount: '1,85,000', time: '14:32:45', isH1: true },
    { bidder: 'BID-0133', amount: '1,80,000', time: '14:31:22', isH1: false },
    { bidder: 'BID-0247', amount: '1,75,000', time: '14:30:08', isH1: false },
    { bidder: 'BID-0089', amount: '1,70,000', time: '14:28:55', isH1: false },
    { bidder: 'BID-0133', amount: '1,65,000', time: '14:27:33', isH1: false },
    { bidder: 'BID-0312', amount: '1,60,000', time: '14:26:10', isH1: false },
    { bidder: 'BID-0089', amount: '1,55,000', time: '14:24:51', isH1: false },
  ]);
  const [paused, setPaused] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [bidders, setBidders] = useState<Bidder[]>(initialBidders);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const token = apiService.getSessionToken() || undefined;
    wsService.connect(token);
    setWsConnected(wsService.isConnected());

    const unsubBid = wsService.subscribe('auction:bid_placed', (msg: any) => {
      const bid = msg.payload as Bid;
      setCurrentBid(bid.amount);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
      setFeed(f => [{
        bidder: bid.bidder.bidderId,
        amount: bid.amount.toLocaleString('en-IN'),
        time: new Date(bid.timestamp).toLocaleTimeString(),
        isH1: bid.isWinning,
      }, ...f.map(b => ({ ...b, isH1: false }))]);
      notificationService.notifyBidPlaced(bid.lotId, 'LOT-HYD-2025-0047', bid.amount, bid.bidderId, 'Bidder');
    });

    const unsubTimer = wsService.subscribe('auction:timer_update', (msg: any) => {
      setTimeLeft(msg.payload.timeRemaining);
    });

    const unsubPause = wsService.subscribe('auction:pause', () => setPaused(true));
    const unsubResume = wsService.subscribe('auction:resume', () => setPaused(false));
    const unsubClose = wsService.subscribe('auction:close', () => navigate('auc-sale-confirmation'));

    const timer = setInterval(() => {
      if (!paused && !wsConnected) {
        setTimeLeft(t => Math.max(0, t - 1));
      }
    }, 1000);

    return () => {
      unsubBid();
      unsubTimer();
      unsubPause();
      unsubResume();
      unsubClose();
      clearInterval(timer);
    };
  }, [paused, wsConnected, navigate]);

  const handleIncrementBid = (increment: number) => {
    const newBid = currentBid + increment;
    setCurrentBid(newBid);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);

    if (wsService.isConnected()) {
      wsService.send({
        type: 'auction:bid_placed',
        payload: {
          lotId: 'lot-1',
          vehicleId: 's-1',
          bidderId: user?.userId || 'BID-0133',
          amount: newBid,
          isWinning: true,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      const newEntry = {
        bidder: user?.userId || 'BID-0133',
        amount: newBid.toLocaleString('en-IN'),
        time: new Date().toLocaleTimeString(),
        isH1: true,
      };
      setFeed(f => [{ ...newEntry }, ...f.map(b => ({ ...b, isH1: false }))]);
    }
  };

  const handleCloseLot = () => {
    if (wsService.isConnected()) {
      wsService.send({
        type: 'auction:close',
        payload: { lotId: 'lot-1' },
        timestamp: new Date().toISOString(),
      });
    }
    navigate('auc-sale-confirmation');
  };

  return (
    <div>
      <PageHeader
        title="Live Auction — LOT-HYD-2025-0047"
        subtitle="Hyderabad District Lot — September 2025 · 3 Vehicles"
        breadcrumb="Home / Live Auction"
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold ${wsConnected ? 'border border-red-500' : 'border border-orange-500'}`}>
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
              {wsConnected ? 'LIVE' : 'LIVE (Demo)'}
            </span>
            <Badge tone={wsConnected ? 'success' : 'warning'} dot>{wsConnected ? 'Connected' : 'Demo Mode'}</Badge>
            <Btn variant="secondary" size="sm" onClick={() => setPaused(!paused)}>{paused ? '▶ Resume' : '⏸ Pause'}</Btn>
            <Btn variant="secondary" size="sm">⏱ Extend 10m</Btn>
            <Btn variant="danger" size="sm" onClick={handleCloseLot}>Close Lot</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide mb-3">Lot Vehicles</h3>
            <div className="flex flex-col gap-2">
              {initialVehicles.map((v, i) => (
                <div key={v.reg} className={`p-3 rounded-lg border-2 ${i === 0 ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0]'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-[#145A43] font-semibold">{v.reg}</p>
                      <p className="text-sm font-medium mt-0.5">{v.make}</p>
                    </div>
                    {i === 0 && <Badge tone="error" dot>Current</Badge>}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <div><p className="text-[#9E9E9E]">Reserve</p><p className="font-semibold">₹{v.reserve}</p></div>
                    <div><p className="text-[#9E9E9E]">Current</p><p className="font-semibold text-[#145A43]">₹{i === 0 ? currentBid.toLocaleString('en-IN') : v.current}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide mb-3">Registered Bidders ({bidders.length})</h3>
            <div className="flex flex-col gap-2">
              {bidders.map(b => (
                <div key={b.id} className={`flex items-center gap-2 p-2 rounded-lg ${b.isActive ? 'bg-[#E6F2ED]' : 'bg-[#F7F8FA]'}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${b.isActive ? 'bg-green-500 animate-pulse' : 'bg-[#9E9E9E]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold font-mono text-[#145A43]">{b.bidderId}</p>
                    <p className="text-[10px] text-[#4A4A4A] truncate">{b.name}</p>
                  </div>
                  <span className="text-[10px] text-green-600">EMD ✓</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5 text-center">
            <p className="text-xs text-[#9E9E9E] uppercase tracking-wide mb-1">Time Remaining</p>
            <p className={`text-5xl font-bold font-mono ${timeLeft < 300 ? 'text-[#C62828]' : 'text-[#1A1A1A]'}`}>{formatTime(timeLeft)}</p>
            <p className="text-xs text-[#9E9E9E] mt-1">Auto-extends on bid in last 10 min</p>
          </Card>

          <Card className={`p-6 text-center transition-all ${pulse ? 'scale-105' : 'scale-100'}`} style={{ transition: 'transform 0.2s' }}>
            <p className="text-xs text-[#9E9E9E] uppercase tracking-wide mb-1">Highest Bid (H1)</p>
            <p className={`text-4xl font-bold text-[#145A43] transition-all ${pulse ? 'text-[#D4A017]' : ''}`}>
              ₹{currentBid.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-[#4A4A4A] mt-1 font-mono">BID-0247 · A.K. Traders</p>
            <p className="text-xs text-[#9E9E9E] mt-0.5">Next increment: ₹5,000</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-[#9E9E9E] uppercase tracking-wide mb-3">Place Bid (Operator)</p>
            <div className="grid grid-cols-3 gap-3">
              {[5000, 10000, 25000].map(inc => (
                <button key={inc} onClick={() => handleIncrementBid(inc)} className="p-2 rounded-lg border-2 border-[#145A43] text-[#145A43] text-sm font-semibold hover:bg-[#145A43] hover:text-white transition-colors cursor-pointer">
                  +₹{inc.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col flex-1">
            <div className="px-4 py-3 border-b border-[#E0E0E0] flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
              <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide">Live Bid Feed</h3>
            </div>
            <div className="flex flex-col divide-y divide-[#E0E0E0] max-h-48 overflow-y-auto">
              {feed.map((bid, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2 ${bid.isH1 ? 'bg-[#E6F2ED]' : ''}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${bid.isH1 ? 'bg-[#145A43]' : 'bg-[#9E9E9E]'}`} />
                  <span className="font-mono text-xs font-semibold text-[#145A43]">{bid.bidder}</span>
                  <span className="flex-1 text-sm font-bold text-[#1A1A1A]">₹{bid.amount}</span>
                  {bid.isH1 && <span className="text-[10px] bg-[#145A43] text-white px-1.5 py-0.5 rounded font-bold">H1</span>}
                  <span className="text-[10px] text-[#9E9E9E] font-mono">{bid.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide mb-3">Auction Controls</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F7F8FA] hover:bg-[#E6F2ED] text-sm text-[#145A43] font-medium cursor-pointer text-left">
                <span>⏱</span> Extend by 10 minutes
              </button>
              <button className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F7F8FA] hover:bg-[#E6F2ED] text-sm text-[#145A43] font-medium cursor-pointer text-left">
                <span>📢</span> Send alert to bidders
              </button>
              <button className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F7F8FA] hover:bg-orange-50 text-sm text-orange-600 font-medium cursor-pointer text-left">
                <span>⚠</span> Flag suspicious activity
              </button>
              <button onClick={() => setPaused(!paused)} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F7F8FA] hover:bg-orange-50 text-sm text-orange-600 font-medium cursor-pointer text-left">
                <span>{paused ? '▶' : '⏸'}</span> {paused ? 'Resume' : 'Pause'} Auction
              </button>
              <button onClick={handleCloseLot} className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-sm text-[#C62828] font-medium cursor-pointer text-left border border-red-200">
                <span>🔴</span> Close & Finalize Lot
              </button>
            </div>
          </Card>

          <Card className="flex flex-col flex-1">
            <div className="px-4 py-3 border-b border-[#E0E0E0]">
              <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide">Activity Log</h3>
            </div>
            <div className="flex flex-col gap-0 divide-y divide-[#E0E0E0] overflow-y-auto max-h-64">
              {[
                { time: '14:32:45', msg: 'BID-0247 placed bid ₹1,85,000 — New H1' },
                { time: '14:31:22', msg: 'BID-0133 placed bid ₹1,80,000' },
                { time: '14:30:08', msg: 'BID-0247 placed bid ₹1,75,000' },
                { time: '14:28:55', msg: 'BID-0089 placed bid ₹1,70,000' },
                { time: '14:27:33', msg: 'BID-0133 placed bid ₹1,65,000' },
                { time: '14:26:10', msg: 'BID-0312 placed bid ₹1,60,000' },
                { time: '14:15:00', msg: 'Lot LOT-HYD-2025-0047 went live' },
                { time: '14:10:00', msg: '4 bidders registered for this lot' },
              ].map((entry, i) => (
                <div key={i} className="flex gap-2 px-3 py-2 text-xs">
                  <span className="text-[#9E9E9E] font-mono shrink-0">{entry.time}</span>
                  <span className="text-[#4A4A4A]">{entry.msg}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}