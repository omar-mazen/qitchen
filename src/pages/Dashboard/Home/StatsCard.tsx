import GlassCard from "@/components/GlassCard";
import React from "react";

interface IProps {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  number: number | string;
}
const StatsCard = ({ Icon, label, number }: IProps) => {
  return (
    <GlassCard>
      <div className="relative border border-border px-8 py-6 rounded-2xl w-[230px] bg-border/20 backdrop-blur-2xl">
        <div className="relative w-full overflow-hidden text-primary bg-background/50 rounded-full">
          <Icon className="inline-block relative z-50 mx-5 p-4 w-7 h-7 !box-content" />
          <span className="font-normal absolute top-1/2 -translate-y-1/2 left-[50px] text-large font-thin uppercase tracking-widest">
            {label}
          </span>
        </div>
        <span className="block mt-5 text-4xl text-center">{number}</span>
      </div>
    </GlassCard>
  );
};

export default StatsCard;

// const StatsCard = ({ Icon, label, number }) => {
//   return (
//     <div className=" relative  border-border px-8 py-6 rounded-2xl w-[150px] group-hover/statsCard:w-[230px] group-hover/statsCard:pb-16 backdrop-blur-3xl bg-border/20 transition-all duration-1000 ease-in-out">
//       <div className="relative w-fit group-hover/statsCard:w-full overflow-hidden text-primary bg-background/50 rounded-l-full rounded-r-full p-4 transition-all duration-1000 ease-in-out">
//         <span className="group-hover/statsCard:mr-5 z-50">
//           <Icon className="bg-background block relative z-50" />
//         </span>
//         <span className="inline-block text-nowrap z-0 absolute h-fit top-1/2 -translate-y-1/2 -left-[200px] group-hover/statsCard:left-[40px] text-large font-thin font-normal uppercase tracking-widest transition-all duration-[1200ms] ease-in-out">
//           {label}
//         </span>
//       </div>
//       <span className="inline-block -translate-x-[cal(50% + 1.25rem)]  absolute top-1/2 left-1/2 group-hover/statsCard:!top-[calc(100%-2rem)] -translate-y-1/2 group-hover/statsCard:-translate-x-1/2 text-4xl text-center transition-all duration-1000 ease-in-out">
//         {number}
//       </span>
//     </div>
//   );
// };
