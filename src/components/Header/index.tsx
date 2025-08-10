import { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader";
import texture from "@images/texture.png";
import SmallScreen from "./SmallScreen";
import LargeScreen from "./LargeScreen";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  function openMenu() {
    setIsMenuOpen(true);
  }
  function closeMenu() {
    setIsMenuOpen(false);
  }
  useEffect(function () {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isSmallScreen ? (
        <SmallScreen openMenu={openMenu} />
      ) : (
        <LargeScreen openMenu={openMenu} />
      )}
      {isMenuOpen && (
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
              <li className="group cursor-pointer w-full">
                <span className="block group-hover:hidden">Menu</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  Menu
                </SectionHeader>
              </li>
              <li className="group cursor-pointer">
                <span className="block group-hover:hidden">reservation</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  reservation
                </SectionHeader>
              </li>
              <li className="group cursor-pointer">
                <span className="block group-hover:hidden">about</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  about
                </SectionHeader>
              </li>
              <li className="group cursor-pointer">
                <span className="block group-hover:hidden">contact</span>
                <SectionHeader className="!hidden group-hover:!flex">
                  contact
                </SectionHeader>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
