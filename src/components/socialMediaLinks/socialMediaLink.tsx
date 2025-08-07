import type { TSocialMediaLink } from "@cTypes/socialMediaLink";
import Badge from "@components/Badge";

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
