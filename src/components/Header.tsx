import React from 'react';
import { MoreHorizontal, X, User, Heart } from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import { ZALO_OA_ID } from '../config/zaloConfig';

interface ZaloUser {
  name: string;
  avatar: string;
}

interface HeaderProps {
  showHeader: boolean;
  showSystemInfo: boolean;
  setShowSystemInfo: (show: boolean) => void;
  setShowDemoAlert: (show: boolean) => void;
  useMockupFrame?: boolean;
  cartCount: number;
  onCartClick: () => void;
  activeTab?: string;
  zaloUser?: ZaloUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  showHeader,
  showSystemInfo,
  setShowSystemInfo,
  setShowDemoAlert,
  useMockupFrame = false,
  cartCount,
  onCartClick,
  activeTab,
  zaloUser
}) => {
  const isHome = activeTab === 'Trang Chủ';

  const handleFollowOA = async () => {
    try {
      const { followOA } = await import('zmp-sdk/apis');
      followOA({
        id: ZALO_OA_ID,
        success: (res) => {
          console.log("Follow OA Success:", res);
        },
        fail: (err) => {
          console.error("Follow OA Failed:", err);
        }
      });
    } catch (e) {
      // Dev mode fallback or local browser support
      console.warn("followOA not supported in browser environment.");
      alert(`Đang mô phỏng yêu cầu Quan tâm Zalo OA với ID: ${ZALO_OA_ID}`);
    }
  };

  return (
    <>
      <header 
        className={`${isHome ? "absolute top-0 left-0 right-0" : "relative"} ${
          isHome 
            ? "bg-black/15 backdrop-blur-md text-white border-none shadow-none"
            : "bg-white text-[#1a191f] border-b border-[#c5a880]/15 shadow-[0_4px_15px_rgba(197,168,128,0.03)]"
        } px-4 flex items-center justify-between z-45 select-none overflow-hidden ${
          showHeader 
            ? "opacity-100" 
            : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
        style={showHeader ? { 
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", 
          paddingBottom: "12px" 
        } : {}}
        id="zalo-mini-app-header"
      >
      {/* Left: User Avatar & Greeting - Always visible */}
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        {/* User Avatar */}
        {zaloUser?.avatar ? (
          <img 
            src={zaloUser.avatar} 
            alt={zaloUser.name}
            className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${
              isHome 
                ? 'border-2 border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.3)]' 
                : 'border-2 border-[#c5a880]/30 shadow-[0_2px_6px_rgba(197,168,128,0.15)]'
            }`}
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isHome 
              ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
              : 'bg-gradient-to-br from-[#c5a880] to-[#9e1a1e] border border-[#c5a880]/20'
          }`}>
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* Greeting Text */}
        <div className="flex flex-col justify-center min-w-0">
          <p className={`text-[10px] font-medium leading-none m-0 ${
            isHome ? 'text-white/70' : 'text-gray-400'
          }`}>
            Xin chào
          </p>
          <p className={`text-[11.5px] font-bold leading-tight m-0 truncate ${
            isHome ? 'text-white' : 'text-[#1a191f]'
          }`}>
            {zaloUser?.name || 'Khách'}{' '}
            <span className={`font-normal ${isHome ? 'text-white/60' : 'text-gray-400'}`}>
              đã đến với KB
            </span>
          </p>
        </div>

        {/* Premium 'Quan tâm' Zalo OA button */}
        <button
          onClick={handleFollowOA}
          className={`px-2 py-0.5 text-[7px] font-black uppercase rounded-full transition-all flex items-center space-x-1 cursor-pointer active:scale-95 flex-shrink-0 ml-1.5 shadow-md border-none ${
            isHome 
              ? 'bg-gradient-to-r from-[#c5a880] to-[#b4956d] hover:from-[#b4956d] hover:to-[#a3835c] text-black shadow-[0_0_8px_rgba(197,168,128,0.4)]' 
              : 'bg-[#9e1a1e] text-white shadow-[0_0_6px_rgba(158,26,30,0.2)]'
          }`}
        >
          <Heart className="w-2.5 h-2.5 fill-current flex-shrink-0" />
          <span>Quan tâm OA</span>
        </button>
      </div>

      {/* Right: Zalo Control Widgets */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {useMockupFrame && (
          <div 
            className={`flex items-center space-x-2 rounded-full px-2.5 py-1.5 shadow-sm transition-all duration-300 ${
              isHome 
                ? 'bg-black/25 backdrop-blur-md border border-white/10' 
                : 'bg-white border border-[#c5a880]/20'
            }`} 
            id="zalo-control-widgets"
          >
            <button 
              onClick={() => setShowSystemInfo(!showSystemInfo)}
              className={`${
                isHome ? 'text-white/80 hover:text-white' : 'text-[#5a462b] hover:text-[#9e1a1e]'
              } transition-colors cursor-pointer focus:outline-none`}
              title="Thông tin ứng dụng"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className={`w-[1px] h-3 ${isHome ? 'bg-white/20' : 'bg-[#c5a880]/25'}`}></div>
            <button 
              onClick={() => setShowDemoAlert(true)}
              className="transition-colors cursor-pointer focus:outline-none"
              title="Thoát"
            >
              <X className={`w-4 h-4 ${
                isHome ? 'text-white/80 hover:text-white' : 'text-[#5a462b] hover:text-[#9e1a1e]'
              }`} />
            </button>
          </div>
        )}
      </div>
    </header>
  </>
  );
};