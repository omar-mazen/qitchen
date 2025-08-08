import Button from "@components/Button";
import Badge from "@components/Badge";
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
        className="bg-background py-4 px-4 absolute bottom-0 right-0 rounded-tl-4xl with-angle"
        aria-label={`Go to ${label}`}
        icon={
          <Badge>
            <Icons.Arrow />
          </Badge>
        }
      >
        {label}
      </Button>
    </figure>
  );
};
export default ImageCard;
