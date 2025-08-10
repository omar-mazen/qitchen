import Icons from "../Icons";
import Button from "../Button";
import Logo from "@icons/logo.svg?react";
import { Link } from "react-router";

const LargeScreen = ({ openMenu }: { openMenu: () => void }) => {
  return (
    <div className="fixed top-20 left-20 z-10 flex items-center gap-10 bg-background/80 backdrop-blur-sm rounded-2xl p-4 shadow-primary/5 shadow-lg">
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
            <Link to={"menu"}>Menu</Link>
          </li>
          <li className="font-normal cursor-pointer">
            <Link to={"about"}>About</Link>
          </li>
          <li>
            <Button type="outline">
              <Link to={"reservation"}>Book a table</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LargeScreen;
