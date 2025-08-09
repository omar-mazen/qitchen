import DotsFill from "@components/DotsFill";
import SectionHeader from "@components/SectionHeader";

import { openingHours } from "@constants/openingHours";

const OpeningHours = () => {
  return (
    <div className="border border-border p-10 rounded-2xl flex flex-col justify-between">
      <SectionHeader size="small">
        <h2 className=" text-heading-h4">opening hours</h2>
      </SectionHeader>
      <ul className="space-y-5">
        {openingHours.map((day) => (
          <li
            key={day.day}
            className=" text-large flex items-center gap-5 font-normal font-thin capitalize space-y-2"
          >
            <p className="text-nowrap">{day.day}</p>
            <DotsFill />
            <p className="text-nowrap">
              {day.from} - {day.to}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpeningHours;
