/**
 * SVAMS — SVG Icon Components
 * All icons exported as PascalCase + Icon suffix.
 * Accept `size` and `className` props.
 */

import type { SVGProps } from "react"

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

const Icon = (path: string, displayName: string) => {
  const Comp = ({ size = 20, className, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {path}
    </svg>
  )
  Comp.displayName = displayName
  return Comp
}

export const SearchIcon = Icon(
  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  "SearchIcon",
)
export const FilterIcon = Icon(
  '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  "FilterIcon",
)
export const ExportIcon = Icon(
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  "ExportIcon",
)
export const AddIcon = Icon(
  '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "AddIcon",
)
export const EditIcon = Icon(
  '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  "EditIcon",
)
export const DeleteIcon = Icon(
  '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  "DeleteIcon",
)
export const ViewIcon = Icon(
  '<circle cx="12" cy="12" r="1"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>',
  "ViewIcon",
)
export const ApproveIcon = Icon(
  '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  "ApproveIcon",
)
export const RejectIcon = Icon(
  '<circle cx="12" cy="8" r="7"/><polyline points="8 21 14 14 18 9"/>',
  "RejectIcon",
)
export const DownloadIcon = Icon(
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  "DownloadIcon",
)
export const UploadIcon = Icon(
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  "UploadIcon",
)
export const SettingsIcon = Icon(
  '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-0.9a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1h-0.9a2 2 0 0 1-2-2 2 2 0 0 1 2-2h0.9a1.65 1.65 0 0 0 1-1.51 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0.9a1.65 1.65 0 0 0 1.51-1v-0.9a2 2 0 0 1 2-2 2 2 0 0 1 2 2v0.9a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33 1.82v0.9a1.65 1.65 0 0 0 1.51 1h0.9a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-0.9a1.65 1.65 0 0 0-1.51 1z"/>',
  "SettingsIcon",
)
export const UserIcon = Icon(
  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "UserIcon",
)
export const MenuIcon = Icon(
  '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  "MenuIcon",
)
export const CloseIcon = Icon(
  '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  "CloseIcon",
)
export const ChevronLeftIcon = Icon(
  '<line x1="15" y1="18" x2="9" y2="12"/><line x1="15" y1="6" x2="9" y2="12"/>',
  "ChevronLeftIcon",
)
export const ChevronRightIcon = Icon(
  '<line x1="9" y1="18" x2="15" y2="12"/><line x1="9" y1="6" x2="15" y2="12"/>',
  "ChevronRightIcon",
)
export const ChevronDownIcon = Icon(
  '<line x1="6" y1="9" x2="18" y2="9"/><line x1="12" y1="9" x2="18" y2="9"/>',
  "ChevronDownIcon",
)
export const ChevronUpIcon = Icon(
  '<line x1="6" y1="15" x2="18" y2="15"/><line x1="12" y1="15" x2="18" y2="15"/>',
  "ChevronUpIcon",
)
export const CheckIcon = Icon(
  '<polyline points="20 6 9 17 4 12"/>',
  "CheckIcon",
)
export const AlertIcon = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  "AlertIcon",
)
export const BellIcon = Icon(
  '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  "BellIcon",
)
export const HelpIcon = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  "HelpIcon",
)
export const LayoutDashboard = Icon(
  '<rect x="3" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="14" width="7" height="7" rx="1" ry="1"/><rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>',
  "LayoutDashboard",
)
export const Car = Icon(
  '<rect x="3" y="8" width="18" height="12" rx="1" ry="1"/><circle cx="6" cy="24" r="2"/><circle cx="18" cy="24" r="2"/><path d="M3 8h2.5l3 7h8l3-7H21"/>',
  "Car",
)
export const PlusCircle = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  "PlusCircle",
)
export const FileText = Icon(
  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  "FileText",
)
export const CheckCircle = Icon(
  '<circle cx="12" cy="12" r="10"/><polyline points="22 12 14 19 7 12"/>',
  "CheckCircle",
)
export const Package = Icon(
  '<rect x="2" y="7" width="20" height="10" rx="1" ry="1"/><polyline points="2.29 7.29 7.29 12 19.71 12"/></svg>',
  "Package",
)
export const Activity = Icon(
  '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  "Activity",
)
export const Users = Icon(
  '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.47"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "Users",
)
export const Award = Icon(
  '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  "Award",
)
export const LayoutGrid = Icon(
  '<rect x="3" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="14" width="7" height="7" rx="1" ry="1"/><rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>',
  "LayoutGrid",
)
export const Gavel = Icon(
  '<path d="M17.62 7.02l2.57 2.57a1 1 0 0 1 0 1.41l-12.38 12.38a1 1 0 0 1-1.41 0L3.5 19.89a1 1 0 0 1 0-1.41l2.57-2.57a1 1 0 0 1 1.41 0L11 9.9l8.62 8.62a1 1 0 0 1 1.41 0l1.59-1.59a1 1 0 0 1 1.41 0"/><path d="M18 2h-3a1 1 0 0 0-.707.293l-4.5 4.5A1 1 0 0 0 9 8v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V6.414z"/>',
  "Gavel",
)
export const Building2 = Icon(
  '<path d="M3 6V2h18v14H3V6z"/><path d="M10 13h4v4h-4z"/><rect x="17" y="7" width="3" height="9"/><rect x="4" y="7" width="3" height="5"/><rect x="7" y="7" width="3" height="9"/><rect x="10" y="7" width="3" height="5"/>',
  "Building2",
)
export const LogOut = Icon(
  '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  "LogOut",
)
export const Globe = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "Globe",
)
export const HelpCircle = Icon(
  '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  "HelpCircle",
)
export const Sun = Icon(
  '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  "Sun",
)
export const Moon = Icon(
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/>',
  "Moon",
)
export const ShieldCheck = Icon(
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="8 10 12 14 16 9"/>',
  "ShieldCheck",
)
export const PlusIcon = Icon(
  '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "PlusIcon",
)
export const Lock = Icon(
  '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "Lock",
)
export const Rocket = Icon(
  '<path d="M13.33 9.03a2 2 0 0 1 0 2.82l-2.81 2.81a.19.19 0 0 0-.27.09l-1.71.44a.19.19 0 0 1-.27-.09l.44-1.71a.19.19 0 0 0-.09-.27l-2.81-2.81a2 2 0 0 1 2.82 0l2.81 2.81a.19.19 0 0 0 .09.27zM12 4a8 8 0 1 1-5.599 2.414L16 2z"/><path d="M13 4l-1 1"/><path d="M11 2l-1 1"/><path d="M9 6l-1 1"/><path d="M12 13a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>',
  "Rocket",
)
export const Database = Icon(
  '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9"/><path d="M3 5a9 9 0 0 0 9 9m9-9c4.714 0 8.571 3.286 9 8m-9 8c-4.714 0-8.571-3.286-9-8m9 8c4.714 0 8.571-3.286 9-8"/><ellipse cx="12" cy="19" rx="9" ry="3"/><path d="M21 15a9 9 0 0 0-9-9m9 9a9 9 0 0 1-9-9"/>',
  "Database",
)
export const CreditCard = Icon(
  '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  "CreditCard",
)
export const AlertCircle = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  "AlertCircle",
)
export const ClockIcon = Icon(
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "ClockIcon",
)
export const TrendingUpIcon = Icon(
  '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  "TrendingUpIcon",
)
export const SaveIcon = Icon(
  '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  "SaveIcon",
)
export const RefreshCwIcon = Icon(
  '<path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>',
  "RefreshCwIcon",
)
export const FileCheckIcon = Icon(
  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M14 14v2.5a.5.5 0 0 0 .5.5h3"/>',
  "FileCheckIcon",
)
export const XCircleIcon = Icon(
  '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  "XCircleIcon",
)
export const ArchiveIcon = Icon(
  '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="12"/><path d="M7 3V1a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>',
  "ArchiveIcon",
)
export const TruckIcon = Icon(
  '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 15 17 15 17 11 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  "TruckIcon",
)
export const CalendarIcon = Icon(
  '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  "CalendarIcon",
)
export const MailIcon = Icon(
  '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  "MailIcon",
)
export const PhoneIcon = Icon(
  '<path d="M5 5a5 5 0 0 1 7.07 1l2.53 2.53a3 3 0 1 1-4.24-4.24l2.53 2.53A5 5 0 0 1 5 5"/>',
  "PhoneIcon",
)
export const MapPinIcon = Icon(
  '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0"/><circle cx="12" cy="10" r="3"/>',
  "MapPinIcon",
)
export const DollarSignIcon = Icon(
  '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  "DollarSignIcon",
)
export const ReceiptIcon = Icon(
  '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14l3 3v12a2 2 0 0 1-2 2z"/>',
  "ReceiptIcon",
)
export const ClipboardIcon = Icon(
  '<path d="M9 5h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M9 1h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/><line x1="9" y1="3" x2="9" y2="21"/>',
  "ClipboardIcon",
)
export const PrinterIcon = Icon(
  '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="2" ry="2"/>',
  "PrinterIcon",
)

export type IconComponent = React.FC<IconProps>

/** Alias exports without Icon suffix (per docs section 13.1) */
export const Search = SearchIcon
export const Filter = FilterIcon
export const Export = ExportIcon
export const Add = AddIcon
export const Edit = EditIcon
export const Delete = DeleteIcon
export const View = ViewIcon
export const Approve = ApproveIcon
export const Reject = RejectIcon
export const Download = DownloadIcon
export const Upload = UploadIcon
export const Settings = SettingsIcon
export const User = UserIcon
export const Menu = MenuIcon
export const Close = CloseIcon
export const ChevronLeft = ChevronLeftIcon
export const ChevronRight = ChevronRightIcon
export const ChevronDown = ChevronDownIcon
export const ChevronUp = ChevronUpIcon
export const Check = CheckIcon
export const Alert = AlertIcon
export const Bell = BellIcon
export const Help = HelpIcon
export const CarIcon = Car
export const Plus = PlusCircle
export const FileTextIcon = FileText
export const CheckCircleIcon = CheckCircle
export const PackageIcon = Package
export const ActivityIcon = Activity
export const UsersIcon = Users
export const AwardIcon = Award
export const LayoutGridIcon = LayoutGrid
export const GavelIcon = Gavel
export const Building2Icon = Building2
export const LogOutIcon = LogOut
export const GlobeIcon = Globe
export const HelpCircleIcon = HelpCircle
export const SunIcon = Sun
export const MoonIcon = Moon
export const ShieldCheckIcon = ShieldCheck
export const Calendar = CalendarIcon
export const DollarSign = DollarSignIcon
export const LockIcon = Lock
export const RocketIcon = Rocket
export const DatabaseIcon = Database
export const CreditCardIcon = CreditCard
export const AlertCircleIcon = AlertCircle
export const ClockIconAlias = ClockIcon
export const TrendingUpIconAlias = TrendingUpIcon
export const SaveIconAlias = SaveIcon
export const RefreshCwIconAlias = RefreshCwIcon
export const FileCheckIconAlias = FileCheckIcon
export const XCircleIconAlias = XCircleIcon
export const ArchiveIconAlias = ArchiveIcon
export const TruckIconAlias = TruckIcon
export const CalendarIconAlias = CalendarIcon
export const MailIconAlias = MailIcon
export const PhoneIconAlias = PhoneIcon
export const MapPinIconAlias = MapPinIcon
export const DollarSignIconAlias = DollarSignIcon
export const ReceiptIconAlias = ReceiptIcon
export const ClipboardIconAlias = ClipboardIcon
export const PrinterIconAlias = PrinterIcon
