import { Link, useNavigate } from "react-router";

import SectionHeader from "../SectionHeader";

import { useAuth } from "@/context/Auth";

import { ROUTES } from "@constants/routes";

import { logout } from "@/services/auth";

import texture from "@images/texture.png";
const NavMenu = ({ closeMenu }: { closeMenu: () => void }) => {
  const guestMenuItems = ["menu", "cart", "reservation", "about", "contact"];
  const userMenuItems = [...guestMenuItems, "profile", "orders"];
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
          {(isAuthenticated ? userMenuItems : guestMenuItems).map((item) => (
            <li className="group cursor-pointer w-full" onClick={closeMenu}>
              <Link to={ROUTES[item.toUpperCase() as keyof typeof ROUTES]}>
                <span className="block group-hover:hidden">{item}</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  {item}
                </SectionHeader>
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li
              className="font-normal cursor-pointer w-full"
              onClick={async () => {
                await logout();
                navigate(ROUTES.HOME, { replace: true });
              }}
            >
              logout
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavMenu;
