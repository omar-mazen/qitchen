import FiveStars from "@components/FiveStars";

const AwardCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="p-8  border border-border rounded-2xl text-center sm:col-span-4 ">
      <div className="flex justify-center gap-2">
        <FiveStars />
      </div>
      <h3 className=" text-heading-h3 mt-3">{title}</h3>
      <p className="text-large font-normal font-thin">{description}</p>
    </div>
  );
};
export default AwardCard;
