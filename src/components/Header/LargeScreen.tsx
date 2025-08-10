import Icons from "../Icons";
import Button from "../Button";
import Logo from "@icons/logo.svg?react";

const LargeScreen = ({ openMenu }: { openMenu: () => void }) => {
  return (
    <div className="fixed top-20 left-20 z-40 flex items-center gap-10 bg-background/80 backdrop-blur-sm rounded-2xl p-4 shadow-primary/5 shadow-lg">
      <Icons.Menu
        className=" cursor-pointer"
        onClick={openMenu}
        aria-label="menu icon toggle"
      />
      <Logo aria-label="qitchen logo" />
      <nav>
        <ul className="flex items-center gap-5">
          <li className="font-normal cursor-pointer">Menu</li>
          <li className="font-normal cursor-pointer">About</li>
          <li>
            <Button type="outline">Book a table</Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LargeScreen;
