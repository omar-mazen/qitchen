import Button from "@components/Button";
import Icons from "@components/Icons";
const ImageCard = ({ image, label }: { image: string; label: string }) => {
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
      >
        {label}
      </Button>
    </figure>
  );
};
export default ImageCard;
