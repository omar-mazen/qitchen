import SocialMediaLink from "./socialMediaLink";
import type { TSocialMediaLink } from "@cTypes/socialMediaLink";

const SocialMediaLinks = ({ links }: { links: TSocialMediaLink[] }) => {
  return (
    <nav
      aria-label="social media links"
      className="absolute bottom-0 right-0 z-3"
    >
      <ul className="flex items-center justify-center  bg-background px-4 py-4 with-angle rounded-tl-4xl">
        {links.map((platform: TSocialMediaLink) => (
          <SocialMediaLink {...platform} />
        ))}
      </ul>
    </nav>
  );
};
export default SocialMediaLinks;
