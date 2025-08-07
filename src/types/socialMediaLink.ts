import type Icons from "@components/Icons";
import type { TIconComponent } from "@cTypes/icons";

export type TSocialMediaLink = {
  name: keyof typeof Icons;
  Icon: TIconComponent;
};
