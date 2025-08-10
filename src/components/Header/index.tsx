import { useEffect, useState } from "react";

import SmallScreen from "./SmallScreen";
import LargeScreen from "./LargeScreen";
import NavMenu from "./Menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 1024
  );
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
      {isMenuOpen && <NavMenu closeMenu={closeMenu} />}
    </>
  );
};

export default Header;
