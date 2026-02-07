import { Link, useNavigate } from "react-router";

import SectionHeader from "../SectionHeader";

import { useAuth } from "@/hooks/useAuth";

import { ROUTES } from "@constants/routes";

import texture from "@images/texture.png";
import { useQueryClient } from "@tanstack/react-query";
import Icons from "../Icons";
const NavMenu = ({ closeMenu }: { closeMenu: () => void }) => {
  const guestMenuItems = ["menu", "cart", "about", "contact"];
  const userMenuItems = [...guestMenuItems, "profile", "orders", "reservation"];
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return (
    <div className="w-full h-full bg-background fixed left-0 top-0 z-50 brightness-150 p-6">
      <span
        className="fixed top-14 right-16 cursor-pointer"
        onClick={closeMenu}
        aria-label="Close menu"
      >
        <Icons.XMark />
      </span>
      <div
        style={{ backgroundImage: `url(${texture})` }}
        className="w-full h-full"
      >
        <ul className="text-center text-heading-h1 space-y-5 rounded-2xl border border-border h-full w-full flex flex-col items-center justify-center">
          {(isAuthenticated ? userMenuItems : guestMenuItems).map((item) => (
            <li className="group cursor-pointer w-full" onClick={closeMenu}>
              <Link
                className="block h-24 relative"
                to={ROUTES[item.toUpperCase() as keyof typeof ROUTES]}
              >
                <span className="block absolute inset-0">{item}</span>
                <SectionHeader className="absolute inset-0 opacity-0 scale-150 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                  <span className=" opacity-0">{item}</span>
                </SectionHeader>
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li
              className="cursor-pointer w-full"
              onClick={async () => {
                await logout().then(() =>
                  queryClient.removeQueries({
                    queryKey: ["user"],
                    exact: false,
                  })
                );
                closeMenu();
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
