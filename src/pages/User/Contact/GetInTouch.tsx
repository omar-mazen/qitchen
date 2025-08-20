import SectionHeader from "@components/SectionHeader";
import { socialMediaLinks } from "@constants/socialMediaLinks";

const getInTouch = [
  { label: "address", value: "23 Greenfield Avenue,Prague 120 00" },
  { label: "phone", value: "+49 1234 567890" },
  { label: "email", value: "email@example.com" },
];

const GetInTouch = () => {
  return (
    <div className="border border-border rounded-2xl p-10 flex flex-col justify-between">
      <SectionHeader size="small">
        <h2 className=" text-h4">get in touch</h2>
      </SectionHeader>
      <ul className="font-normal font-thin text-large space-y-10 h-full flex flex-col justify-around pt-10 ">
        {getInTouch.map((obj) => (
          <li className="flex gap-24 justify-between">
            <p className="text-nowrap capitalize">{obj.label}</p>
            <p className=" text-right">{obj.value}</p>
          </li>
        ))}
        <li className="flex items-center justify-between">
          <p>Follow</p>
          <ul className="flex gap-5 items-center">
            {socialMediaLinks.map((platform) => (
              <li className=" cursor-pointer" key={platform.name}>
                {<platform.Icon />}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default GetInTouch;
