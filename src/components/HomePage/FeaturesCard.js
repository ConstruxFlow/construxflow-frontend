import React from 'react';

function FeaturesCard({ icon: Icon, title, description,iconBg = "bg-deep_green" }) {
  return (
    <div className="w-[400px] h-[240px] bg-[#1A1A1A]/40 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden relative">
      <div className="absolute inset-0 flex flex-col px-5 items-start gap-4 justify-center text-white pointer-events-none">
        <div className={`text-purewhite ${iconBg} rounded p-1 w-fit flex items-center justify-center`}>
          {Icon && <Icon className="text-3xl" />}
        </div>
        <p className="text-purewhite font-bold text-xl">{title}</p>
        <p className="font-light text-light_gray">{description}</p>
        <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
      </div>
    </div>
  );
}

export default FeaturesCard;
