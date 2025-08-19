import SectionHeader from "@components/SectionHeader";
import { awards } from "@constants/awards";
import PageLayout from "@components/PageLayout";
import AwardCard from "./AwardCard";

import banner from "@images/about/about.png";
import restaurant from "@images/about/Image (4).png";
import team from "@images/about/Image (9).png";
const About = () => {
  return (
    <PageLayout banner={banner} caption="About">
      <div className="grid grid-cols-1 sm:grid-cols-12 sm:gap-5 gap-10 overflow-y-scroll h-full">
        <div className="border border-border rounded-2xl sm:col-span-6 p-12 flex flex-col justify-between">
          <h3 className=" text-heading-h3 text-center sm:text-left pb-12 sm:pb-0 sm:max-w-96">
            Sushi Artistry Redefined
          </h3>
          <p className="text-center sm:text-left font-normal font-thin text-large">
            Where culinary craftsmanship meets modern elegance. Indulge in the
            finest sushi, expertly curated to elevate your dining experience.
          </p>
        </div>
        <figure className="border border-border rounded-2xl sm:col-span-6 overflow-hidden h-full w-full hidden sm:block">
          <img
            src={restaurant}
            alt="Modern sushi restaurant interior"
            className="w-full !h-full object-cover"
          />
        </figure>
        {awards.map((award) => (
          <AwardCard {...award} />
        ))}
        <figure className="border border-border rounded-2xl sm:col-span-6 w-full h-full overflow-hidden hidden sm:block">
          <img src={team} alt="" className="w-full !h-full object-cover" />
        </figure>
        <div className="border border-border rounded-2xl sm:col-span-6 p-12 flex flex-col justify-between">
          <SectionHeader size="small">
            <h2>our story</h2>
          </SectionHeader>
          <p className="font-normal font-thin text-center text-medium">
            Founded with a passion for culinary excellence, Qitchen's journey
            began in the heart of Prague. Over years, it evolved into a haven
            for sushi enthusiasts, celebrated for its artful mastery and
            devotion to redefining gastronomy.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
