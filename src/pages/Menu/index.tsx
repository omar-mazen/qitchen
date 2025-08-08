import { MenuImages } from "@constants/images";
import MenuLabels from "./MenuLabels";
import Category from "./Category";
import texture from "@images/texture.png";
import menuBanner from "@images/menu/menu.png";
const menu = {
  maki: [
    {
      name: "Spicy Tuna Maki",
      image: MenuImages.spicyTunaMaki,
      price: "5",
      description:
        "A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.",
    },
    {
      name: "Mango Maki",
      image: MenuImages.mangoMaki,
      price: "5",
      description:
        "Tempura-fried shrimp, cucumber, and cream cheese embrace a center of fresh avocado, delivering a satisfying contrast of textures.",
    },
    {
      name: "Salmon Maki",
      image: MenuImages.salmonMaki,
      price: "5",
      description:
        "Shiitake mushrooms, avocado, and pickled daikon radish nestle within a roll of seasoned rice, coated with nutty sesame seeds.",
    },
    {
      name: "Tuna Maki",
      image: MenuImages.tunaMaki,
      price: "5",
      description:
        "A vibrant assortment of julienned carrots, bell peppers, and cucumber, tightly encased in a nori-wrapped rice roll.",
    },
  ],
  "special rolls": [
    {
      name: "Sunrise Bliss",
      image: MenuImages.sunriseBliss,
      price: "16",
      description:
        "A delicate combination of fresh salmon, cream cheese, and asparagus, rolled in orange-hued tobiko for a burst of sunrise-inspired flavors.",
    },
    {
      name: "Mango Tango Fusion",
      image: MenuImages.mangoTangoFusion,
      price: "16",
      description:
        "Tempura shrimp, cucumber, and avocado dance alongside sweet mango slices, drizzled with a tangy mango sauce.",
    },
    {
      name: "Truffle Indulgence",
      image: MenuImages.truffleIndulgence,
      price: "16",
      description:
        "Decadent slices of black truffle grace a roll of succulent wagyu beef, cucumber, and microgreens, culminating in an exquisite umami symphony.",
    },
    {
      name: "Pacific Firecracker",
      image: MenuImages.pacificFirecracker,
      price: "16",
      description:
        "Spicy crab salad, tempura shrimp, and jalapeño peppers combine in a fiery ensemble, accented with a chili-infused aioli.",
    },
    {
      name: "Eternal Eel Enchantment",
      image: MenuImages.eternalEelEnchantment,
      price: "16",
      description:
        "An enchanting blend of eel tempura, foie gras, and cucumber, elegantly layered with truffle oil and gold leaf for a touch of opulence.",
    },
  ],
};
const menuKeys = Object.keys(menu);

const Menu = () => {
  return (
    <div
      style={{ backgroundImage: `url(${texture})` }}
      className="grid gap-5 lg:grid-cols-2 min-h-full h-full rounded-2xl overflow-hidden"
    >
      <aside className="relative hidden overflow-hidden lg:block">
        <figure className="reltive rounded-2xl overflow-hidden w-full h-full after:bg-gradient-to-t after:from-background/50 after:to-transparent after:absolute after:bottom-0 after:z-1 after:w-full after:h-1/2 after:rounded-2xl after:overflow-hidden">
          <img
            src={menuBanner}
            alt="Decorative menu banner"
            role="presentation"
            className="w-full !h-full object-cover"
          />
          <figcaption className="absolute bottom-20 left-20 text-heading-large z-2">
            Menu
          </figcaption>
        </figure>
      </aside>
      <main className="border border-border rounded-2xl overflow-y-scroll h-full">
        <MenuLabels labels={menuKeys} />
        {menuKeys.map((category) => (
          <Category
            category={menu[category as keyof typeof menu]}
            categoryName={category as keyof typeof menu}
            key={category}
          />
        ))}
      </main>
    </div>
  );
};

export default Menu;
