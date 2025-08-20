import Button from "@components/Button";
import Icons from "@components/Icons";
import PageLayout from "@components/PageLayout";
import OpeningHours from "./OpeningHours";
import GetInTouch from "./GetInTouch";

import { contactImages } from "@constants/images";

import banner from "@images/contact/Image (10).png";
import map from "@images/map.png";

const Contact = () => {
  return (
    <PageLayout banner={banner} caption="contact">
      <div className="overflow-y-scroll grid sm:grid-cols-2 gap-10 sm:gap-5 h-full sm:grid-rows-2">
        <OpeningHours />
        <div className="grid grid-cols-2 gap-5">
          {contactImages.map((image, i) => (
            <figure
              className="rounded-2xl overflow-hidden"
              role="presentation"
              key={`contact image ${i}`}
            >
              <img
                src={image}
                className="w-full !h-full object-cover"
                alt="Restaurant interior"
              />
            </figure>
          ))}
        </div>
        <div className="relative overflow-y-visible overflow-x-clip sm:overflow-y-hidden  z-10">
          <Button withAngle={true} type="icon" icon={<Icons.Arrow />}>
            get direction
          </Button>
          <figure className="!h-auto w-full rounded-2xl overflow-hidden">
            <img
              src={map}
              alt="Map showing restaurant location"
              className="w-full !h-auto"
            />
          </figure>
        </div>
        <GetInTouch />
      </div>
    </PageLayout>
  );
};

export default Contact;
