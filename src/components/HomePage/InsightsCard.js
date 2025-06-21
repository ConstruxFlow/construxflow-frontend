import { FaArrowUpLong } from "react-icons/fa6";

function InsightsCard({
  icon: Icon,
  title,
  main_percentage,
  percentage,
  plus,
  bordercolor, // default to a Tailwind class
  iconBg = "bg-deep_green",
}) {
  // If bordercolor is a hex code, use inline style; else, use Tailwind class
  const isHex = bordercolor.startsWith("#");

  return (
    <div
      className={`w-[300px] h-[180px] bg-[#1A1A1A]/40 rounded-[16px] border ${bordercolor} shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden relative
      }`}
    >
      <div className="absolute inset-0 flex flex-col px-5 items-start gap-2 justify-center text-white pointer-events-none">
        <div className="w-full flex items-center justify-between">
          <div
            className={`text-purewhite ${iconBg} rounded p-1 w-fit flex items-center justify-center`}
          >
            {Icon && <Icon className="text-xl" />}
          </div>
          {plus ? (
            <p className="text-web_yellow text-xs flex gap-1 items-center">
              <FaArrowUpLong /> +{percentage}
            </p>
          ) : (
            <p className="text-red-700 text-xs flex gap-1 items-center">
              <FaArrowUpLong className="rotate-180" /> -{percentage}
            </p>
          )}
        </div>
        <p className="text-purewhite text-2xl">{main_percentage}</p>
        <p className="text-[#D1D5DB] text-base font-extralight">{title}</p>
        <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
      </div>
    </div>
  );
}

export default InsightsCard;
