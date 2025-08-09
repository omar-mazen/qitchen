import Icons from "./Icons";

const FiveStars = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <Icons.Star key={`start ${i}`} className=" w-5" />
  ));
};

export default FiveStars;
