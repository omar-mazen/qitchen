import SectionHeader from "../SectionHeader";
import texture from "@images/texture.png";
import { Link } from "react-router";
import { ROUTES } from "@/constants/routes";

const menuItems: (typeof ROUTES)[keyof typeof ROUTES][] = [
  "menu",
  "reservation",
  "about",
  "contact",
];
const NavMenu = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <div className="w-full h-full bg-background fixed left-0 top-0 z-50 brightness-150 p-6">
      <span
        className="fixed top-14 right-16 cursor-pointer"
        onClick={closeMenu}
        aria-label="Close menu"
      >
        x
      </span>
      <div
        style={{ backgroundImage: `url(${texture})` }}
        className="w-full h-full"
      >
        <ul className="text-center text-heading-h1 space-y-5 rounded-2xl border border-border h-full w-full flex flex-col items-center justify-center">
          {menuItems.map((item) => (
            <li className="group cursor-pointer w-full" onClick={closeMenu}>
              <Link to={ROUTES[item.toUpperCase() as keyof typeof ROUTES]}>
                <span className="block group-hover:hidden">{item}</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  {item}
                </SectionHeader>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavMenu;
