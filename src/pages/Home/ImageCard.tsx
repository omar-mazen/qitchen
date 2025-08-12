import Button from "@components/Button";
import Icons from "@components/Icons";
import { useNavigate } from "react-router";
const ImageCard = ({
  image,
  label,
  link,
}: {
  image: string;
  label: string;
  link: string;
}) => {
  const navigate = useNavigate();
  return (
    <figure
      className={`relative w-full h-full bg-cover rounded-2xl aspect-square`}
      style={{ backgroundImage: `url(${image})` }}
      aria-label={label}
      role="img"
    >
      <figcaption className="sr-only">{label}</figcaption>

      <Button
        type="icon"
        aria-label={`Go to ${label}`}
        withAngle={true}
        icon={<Icons.Arrow />}
        onClick={() => navigate(link)}
      >
        {label}
      </Button>
    </figure>
  );
};
export default ImageCard;
