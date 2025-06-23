import React from 'react'
function DayWidgets({ day, date,dateBg }) {
    return <div className="flex flex-col gap-3 items-center">
        <p className="text-[#6B7280]">{day}</p>
        <div className={`w-[15px] h-[15px] p-4  ${dateBg} rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden`}>
            <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center text-white pointer-events-none">
                <p className="font-light text-black">{date}</p>
            </div>
        </div>
    </div>;
}

export default DayWidgets;