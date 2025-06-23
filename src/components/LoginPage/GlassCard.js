import React from 'react';

function GlassCard({ 
  title, 
  timeSlot, 
  statusColor = "bg-web_yellow", 
  className = ""
}) {
  return (
    <div className={`absolute  w-[270px] h-[86px] bg-[#1A1A1A]/5 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex flex-col gap-1 items-start px-3 justify-center text-white pointer-events-none">
        <div className="w-full flex justify-between">
          <div>
            <p className="text-black font-semibold text-base">
              {title}
            </p>
            <p className="font-light text-sm text-light_gray">
              {timeSlot}
            </p>
          </div>
          <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
        </div>
        <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
      </div>
    </div>
  );
}

export default GlassCard;