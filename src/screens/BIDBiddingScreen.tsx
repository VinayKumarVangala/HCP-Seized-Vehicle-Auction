import React, { useState, useEffect } from 'react';
import { useNav } from '../nav';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../api/service';
import { wsService } from '../api/websocket';
import { notificationService } from '../api/notifications';
import { PageHeader, Badge, Btn, Card } from '../components/ui';
import type { Bid } from '../api/types';

const initialBidHistory = [
  { bidder: 'BID-0247', amount: '1,85,000', time: '14:32:45', mine: false },
  { bidder: 'You (BID-0133)', amount: '1,80,000', time: '14:31:22', mine: true },
  { bidder: 'BID-0247', amount: '1,75,000', time: '14:30:08', mine: false },
  { bidder: 'You (BID-0133)', amount: '1,70,000', time: '14:28:55', mine: true },
  { bidder: 'BID-0089', amount: '1,65,000', time: '14:27:33', mine: false },
];

export default function BIDBiddingScreen() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [myBid, setMyBid] = useState(190000);
  const [h1, setH1] = useState(185000);
  const [timeLeft, setTimeLeft] = useState(1847);
  const [autoBid, setAutoBid] = useState(false);
  const [autoBidLimit, setAutoBidLimit] = useState('');
  const [bidPlaced, setBidPlaced] = useState(false);
  const [feed, setFeed] = useState<any[]>(initialBidHistory);
  const [wsConnected, setWsConnected] = useState(false);
  const [isH1, setIsH1] = useState(false);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;

  useEffect(() => {
    const token = apiService.getSessionToken() || undefined;
    wsService.connect(token);
    setWsConnected(wsService.isConnected());

    const unsubBid = wsService.subscribe('auction:bid_placed', (msg: any) => {
      const bid = msg.payload as Bid;
      const isMine = bid.bidderId === user?.userId;
      setH1(bid.amount);
      setIsH1(isMine);
      setFeed(f => [{
        bidder: isMine ? `You (${bid.bidder.bidderId})` : bid.bidder.bidderId,
        amount: bid.amount.toLocaleString('en-IN'),
        time: new Date(bid.timestamp).toLocaleTimeString(),
        mine: isMine,
      }, ...f]);
      if (isMine) {
        notificationService.notifyBidPlaced(bid.lotId, 'LOT-HYD-2025-0047', bid.amount, bid.bidderId, 'Bidder');
      }
    });

    const unsubTimer = wsService.subscribe('auction:timer_update', (msg: any) => {
      setTimeLeft(msg.payload.timeRemaining);
    });

    const unsubClose = wsService.subscribe('auction:close', () => {
      setTimeout(() => navigate('auc-sale-confirmation'), 1000);
    });

    const timer = setInterval(() => {
      if (!wsConnected) setTimeLeft(s => Math.max(0, s - 1));
    }, 1000);

    return () => {
      unsubBid();
      unsubTimer();
      unsubClose();
      clearInterval(timer);
    };
  }, [user?.userId, navigate]);

  const handlePlaceBid = () => {
    if (myBid <= h1) return;
    setBidPlaced(true);
    const newH1 = myBid;
    setH1(newH1);
    setIsH1(true);
    setFeed(f => [{ bidder: `You (BID-0133)`, amount: newH1.toLocaleString('en-IN'), time: new Date().toLocaleTimeString(), mine: true }, ...f]);

    if (wsService.isConnected()) {
      wsService.send({
        type: 'auction:bid_placed',
        payload: {
          lotId: 'lot-1',
          vehicleId: 's-1',
          bidderId: user?.userId || 'BID-0133',
          amount: newH1,
          isWinning: true,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    }

    setTimeout(() => setBidPlaced(false), 2000);
  };

  const handleAutoBidToggle = () => {
    setAutoBid(!autoBid);
    if (autoBidLimit && wsService.isConnected()) {
      wsService.send({
        type: 'auction:bid_placed',
        payload: {
          lotId: 'lot-1',
          vehicleId: 's-1',
          bidderId: user?.userId || 'BID-0133',
          amount: parseInt(autoBidLimit.replace(/,/g, '')) || 0,
          isWinning: false,
          isAutoBid: true,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div>
      {bidPlaced && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 p-4 bg-[#145A43] text-white rounded-xl shadow-2xl">
          <span>🎉</span>
          <span className="text-sm font-medium">Bid placed! You are the highest bidder (H1)</span>
        </div>
      )}

      <PageHeader
        title="Live Bidding — LOT-HYD-2025-0047"
        subtitle="Hyderabad District Lot · Honda Activa 6G · Tata Ace · Hyundai i10"
        breadcrumb="Browse Auctions / Bidding"
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold ${wsConnected ? 'border border-red-500' : 'border border-orange-500'}`}>
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
              {wsConnected ? 'LIVE' : 'LIVE (Demo)'}
            </span>
            <Badge tone={wsConnected ? 'success' : 'warning'} dot>{wsConnected ? 'Connected' : 'Demo Mode'}</Badge>
            <div className="text-right">
              <p className="text-xs text-[#9E9E9E]">Time Left</p>
              <p className={`text-lg font-mono font-bold ${timeLeft < 300 ? 'text-[#C62828]' : 'text-[#1A1A1A]'}`}>{formatTime(timeLeft)}</p>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A]">Your Position</h3>
              <Badge tone={isH1 ? 'success' : 'warning'} dot>{isH1 ? 'H1' : 'H2'}</Badge>
            </div>
            {!isH1 && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 mb-3">
                <p className="text-xs text-orange-700 font-medium">You are outbid!</p>
                <p className="text-xs text-orange-600 mt-0.5">Current H1: BID-0247 at ₹{h1.toLocaleString('en-IN')}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="p-3 rounded-lg bg-[#F7F8FA] text-center">
                <p className="text-xs text-[#9E9E9E]">Your Last Bid</p>
                <p className="font-bold text-[#1A1A1A]">₹{myBid.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F8FA] text-center">
                <p className="text-xs text-[#9E9E9E]">EMD Balance</p>
                <p className="font-bold text-[#145A43]">₹10,000</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-[#9E9E9E] mb-2">Your bid (minimum: ₹{(h1 + 5000).toLocaleString('en-IN')})</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={myBid}
                  onChange={e => setMyBid(Number(e.target.value))}
                  className="flex-1 h-10 px-3 rounded-lg border border-[#E0E0E0] text-sm font-mono font-semibold focus:border-[#145A43] focus:ring-2 focus:ring-[#145A43]/20 outline-none"
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={myBid <= h1}
                  className="px-4 h-10 rounded-lg bg-[#B8860B] hover:bg-[#D4A017] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bid
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[5000, 10000, 25000].map(inc => (
                <button key={inc} onClick={() => setMyBid(h1 + inc)} className="p-2 rounded-lg border border-[#E0E0E0] text-xs text-[#145A43] font-medium hover:bg-[#E6F2ED] cursor-pointer">
                  +₹{inc.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className={`p-3 rounded-xl border-2 transition-colors ${autoBid ? 'border-[#145A43] bg-[#E6F2ED]' : 'border-[#E0E0E0]'}`}>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <div
                  onClick={handleAutoBidToggle}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${autoBid ? 'bg-[#145A43]' : 'bg-[#9E9E9E]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${autoBid ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm font-medium text-[#1A1A1A]">Auto-Bid</span>
              </label>
              {autoBid && (
                <div>
                  <p className="text-xs text-[#4A4A4A] mb-1">Maximum auto-bid limit (₹)</p>
                  <input
                    type="text"
                    value={autoBidLimit}
                    onChange={e => setAutoBidLimit(e.target.value)}
                    placeholder="e.g. 2,50,000"
                    className="w-full h-8 px-2 text-sm border border-[#145A43] rounded-lg font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-[#9E9E9E] mt-1">System will automatically bid up to this limit</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Wallet</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[#4A4A4A]">EMD Deposited</span><span className="font-semibold text-[#145A43]">₹10,000</span></div>
              <div className="flex justify-between"><span className="text-[#4A4A4A]">Balance</span><span className="font-semibold">₹10,000</span></div>
              <div className="h-px bg-[#E0E0E0]" />
              <button className="text-xs text-[#145A43] hover:underline cursor-pointer text-left">+ Add Funds</button>
            </div>
          </Card>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <Card className="p-6 text-center">
            <p className="text-xs text-[#9E9E9E] uppercase tracking-widest mb-1">Current Highest Bid (H1)</p>
            <p className="text-5xl font-bold text-[#145A43] mb-1">₹{h1.toLocaleString('en-IN')}</p>
            <p className="text-sm text-[#4A4A4A] font-mono">BID-0247</p>
            <p className="text-xs text-[#9E9E9E] mt-2">Bid increment: ₹5,000 · Next minimum bid: ₹{(h1 + 5000).toLocaleString('en-IN')}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Vehicles in This Lot</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { reg: 'TS09EA1234', make: 'Honda Activa 6G', reserve: '1,25,000', icon: '🛵' },
                { reg: 'TS05MK3456', make: 'Tata Ace Gold', reserve: '3,50,000', icon: '🚛' },
                { reg: 'TS03PQ2211', make: 'Hyundai i10 Nios', reserve: '2,80,000', icon: '🚗' },
              ].map(v => (
                <div key={v.reg} className="p-3 rounded-xl border border-[#E0E0E0] text-center">
                  <div className="text-3xl mb-1">{v.icon}</div>
                  <p className="font-mono text-xs text-[#145A43] font-semibold">{v.reg}</p>
                  <p className="text-xs text-[#4A4A4A] truncate">{v.make}</p>
                  <p className="text-xs font-bold mt-1">₹{v.reserve}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col flex-1">
            <div className="px-4 py-3 border-b border-[#E0E0E0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide flex-1">Bid History</h3>
              <span className="text-xs text-[#9E9E9E]">{feed.length} bids placed</span>
            </div>
            <div className="flex flex-col divide-y divide-[#E0E0E0]">
              {feed.map((bid, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${bid.mine ? 'bg-[#E6F2ED]' : ''}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-[#D4A017]' : bid.mine ? 'bg-[#145A43]' : 'bg-[#9E9E9E]'}`} />
                  <span className={`font-mono text-sm font-semibold ${bid.mine ? 'text-[#145A43]' : 'text-[#4A4A4A]'}`}>{bid.bidder}</span>
                  <span className="flex-1 font-bold text-[#1A1A1A]">₹{bid.amount}</span>
                  {i === 0 && <span className="text-[10px] bg-[#D4A017] text-white px-1.5 py-0.5 rounded font-bold">H1</span>}
                  {bid.mine && i !== 0 && <span className="text-[10px] bg-[#145A43]/10 text-[#145A43] px-1.5 py-0.5 rounded font-medium">You</span>}
                  <span className="text-[10px] text-[#9E9E9E] font-mono">{bid.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}