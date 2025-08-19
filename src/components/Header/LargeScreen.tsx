import { Link } from "react-router";

import Icons from "../Icons";
import Button from "../Button";
import Logo from "@icons/logo.svg?react";

import { useAuth } from "@/context/Auth";

import { ROUTES } from "@constants/routes";

const LargeScreen = ({ openMenu }: { openMenu: () => void }) => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="fixed top-20 left-20 z-10 flex items-center gap-10 bg-background/70 backdrop-blur-sm rounded-2xl p-4 shadow-primary/2 shadow-lg">
      <Icons.Menu
        className=" cursor-pointer"
        onClick={openMenu}
        aria-label="menu icon toggle"
      />
      <Link to="/">
        <Logo aria-label="qitchen logo" />
      </Link>
      <nav>
        <ul className="flex items-center gap-5">
          <li className="font-normal cursor-pointer">
            <Link to={ROUTES.MENU}>Menu</Link>
          </li>
          <li className="font-normal cursor-pointer">
            <Link to={ROUTES.CART}>Cart</Link>
          </li>
          {isAuthenticated && user?.role == "User" ? (
            <>
              <li className="font-normal cursor-pointer">
                <Link to={ROUTES.ORDERS}>Orders</Link>
              </li>
              <li className="font-normal cursor-pointer">
                <Link to={ROUTES.PROFILE}>Profile</Link>
              </li>
            </>
          ) : (
            <>
              <li className="font-normal cursor-pointer">
                <Link to={ROUTES.LOGIN}>Login</Link>
              </li>
              <li className="font-normal cursor-pointer">
                <Link to={ROUTES.REGISTER}>Register</Link>
              </li>
            </>
          )}
          <li>
            <Button type="outline">
              <Link to={ROUTES.RESERVATION}>Book a table</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LargeScreen;
