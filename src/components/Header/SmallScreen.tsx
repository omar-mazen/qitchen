import Logo from "@icons/logo.svg?react";
import Icons from "../Icons";

const SmallScreen = ({ openMenu }: { openMenu: () => void }) => {
  return (
    <div className="flex items-center p-4 bg-background rounded-2xl border border-border relative mb-5">
      <Icons.Menu
        onClick={openMenu}
        className=" cursor-pointer"
        aria-label="menu icon toggle"
      />
      <Logo
        className=" place-content-center fixed left-1/2 -translate-x-1/2"
        aria-label="qitchen logo"
      />
    </div>
  );
};

export default SmallScreen;
