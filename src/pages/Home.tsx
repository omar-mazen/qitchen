import Button from "@/components/Button";
import { HomeImages } from "@constants/images";
import Badge from "@components/Badge";
import Icons from "@components/Icons";

const cards = [
  { image: HomeImages.menu, label: "Menu" },
  { image: HomeImages.reservation, label: "Reservation" },
  { image: HomeImages.restaurant, label: "Our Restaurant" },
];
const Home = () => {
  return (
    <main className="grid gap-5 grid-cols-1 md:grid-cols-[70%_30%] md:grid-rows-3 h-full overflow-y-auto overflow-x-hidden md:overflow-y-hidden">
      <section className="bg-[url('/src/assets/images/home/1.png')] aspect-square md:aspect-auto relative w-full h-full bg-cover md:row-start-1 md:row-end-4 rounded-2xl after:bg-gradient-to-t after:from-background/50 after:to-transparent after:absolute after:z-2 after:w-full after:h-full after:rounded-2xl after:overflow-hidden">
        <p className="text-heading-h3 absolute top-6 left-6 sm:text-heading-medium md:text-heading-large lg:text-heading-xlarge sm:top-auto sm:bottom-18 sm:left-20-20 z-3">
          Sushi <br />
          Sensation
        </p>
        <ul className="flex items-center justify-center absolute bottom-0 right-0 z-3 bg-background px-4 py-4 with-angle rounded-tl-4xl">
          <li>
            <Badge>
              <Icons.Facbook aria-label="facebook" />
            </Badge>
          </li>
          <li>
            <Badge>
              <Icons.Instagram aria-label="instagram" />
            </Badge>
          </li>
          <li>
            <Badge>
              <Icons.Twitter aria-label="twitter" />
            </Badge>
          </li>
        </ul>
      </section>
      {cards.map((card) => (
        <ImageCard label={card.label} image={card.image} key={card.label} />
      ))}
    </main>
  );
};

const ImageCard = ({ image, label }: { image: string; label: string }) => {
  return (
    <div
      className={`relative w-full h-full bg-cover rounded-2xl aspect-square`}
      style={{ backgroundImage: `url(${image})` }}
      aria-label={label}
    >
      <Button
        type="icon"
        additionalStyle="bg-background py-4 px-4 absolute bottom-0 right-0 rounded-tl-4xl with-angle"
        icon={
          <Badge>
            <Icons.Arrow />
          </Badge>
        }
      >
        {label}
      </Button>
    </div>
  );
};
export default Home;
