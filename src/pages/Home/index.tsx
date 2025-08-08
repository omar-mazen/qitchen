import { HomeImages } from "@constants/images";
import Icons from "@components/Icons";
import ImageCard from "./ImageCard";
import SocialMediaLinks from "@components/socialMediaLinks";
import type { TSocialMediaLink } from "@cTypes/socialMediaLink";

const cards = [
  { image: HomeImages.menu, label: "Menu" },
  { image: HomeImages.reservation, label: "Reservation" },
  { image: HomeImages.restaurant, label: "Our Restaurant" },
];
const socialMediaLinks: TSocialMediaLink[] = [
  {
    name: "Facbook",
    Icon: Icons.Facbook,
  },
  {
    name: "Instagram",
    Icon: Icons.Instagram,
  },
  {
    name: "Twitter",
    Icon: Icons.Twitter,
  },
];
const Home = () => {
  return (
    <main className="grid gap-5 grid-cols-1 md:grid-cols-[70%_30%] md:grid-rows-3 h-full overflow-y-auto overflow-x-hidden md:overflow-y-hidden">
      <section
        style={{ backgroundImage: `url(${HomeImages.banner})` }}
        className=" aspect-square md:aspect-auto relative w-full h-full bg-cover md:row-start-1 md:row-end-4 rounded-2xl after:bg-gradient-to-t after:from-background/50 after:to-transparent after:absolute after:z-2 after:w-full after:h-full after:rounded-2xl after:overflow-hidden"
      >
        <p className="text-heading-h3 absolute top-6 left-6 sm:text-heading-medium md:text-heading-large lg:text-heading-xlarge sm:top-auto sm:bottom-18 sm:left-20-20 z-3">
          Sushi <br />
          Sensation
        </p>
        <SocialMediaLinks links={socialMediaLinks} />
      </section>
      {cards.map((card) => (
        <ImageCard label={card.label} image={card.image} key={card.label} />
      ))}
    </main>
  );
};

export default Home;
