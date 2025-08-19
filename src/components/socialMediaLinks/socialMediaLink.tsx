import Badge from "@components/Badge";
import type { TSocialMediaLink } from "@cTypes/socialMediaLink";

const SocialMediaLink = ({ name, Icon }: TSocialMediaLink) => {
  return (
    <li>
      <Badge>
        <Icon aria-label={name.toLowerCase()} />
      </Badge>
    </li>
  );
};
export default SocialMediaLink;
