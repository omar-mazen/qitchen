import { Link, NavLink, Outlet } from "react-router";

import texture from "@images/texture.png";
import Logo from "@icons/logo.svg?react";
import { DASHBOARD } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import Icons from "../Icons";
import { Suspense, useState } from "react";
import clsx from "clsx";
import Loader from "../Loader";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { useLoading } from "@/hooks/useLoading";

const links = [
  { Label: "home", link: DASHBOARD.HOME, icon: Icons.Home },
  { Label: "orders", link: DASHBOARD.ORDERS, icon: Icons.Cart },
  {
    Label: "menu management",
    link: DASHBOARD.MENU_MANAGEMENT,
    icon: Icons.Clipboard,
  },
  { Label: "tables", link: DASHBOARD.TABLES, icon: Icons.Table },
  { Label: "reservation", link: DASHBOARD.RESERVATION, icon: Icons.Calendar },
  { Label: "settings", link: DASHBOARD.SETTINGS, icon: Icons.Cog },
];
export const DashboardLayout = () => {
  const { logout } = useAuth();
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false);
  useNavigationLoader();
  const { isLoading } = useLoading();

  return (
    <div
      style={{ background: `url(${texture})` }}
      className={clsx(
        "h-full w-full backdrop-brightness-150 rounded-2xl overflow-hidden grid border border-border divide-border divide-x",
        isSideMenuOpened
          ? " grid-cols-[300px_1fr]"
          : " grid-cols-[calc(6rem+20px)_1fr]"
      )}
    >
      {isLoading && <Loader />}
      <aside>
        <div
          className={clsx(
            "flex items-center gap-5 border-b border-border h-[54px]"
          )}
        >
          <Icons.Menu
            className={clsx("cursor-pointer z-50 !box-content pl-8")}
            onClick={() => setIsSideMenuOpened((st) => !st)}
          />
          {isSideMenuOpened && (
            <Link
              to={DASHBOARD.HOME}
              className="grow -ml-[calc(1.25rem+41px)] "
            >
              <Logo className="w-full !box-content py-4 h-8" />
            </Link>
          )}
        </div>
        <nav>
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li
                key={`nav ${link.Label} link`}
                className=" h-[54px] group/label relative hover:text-background hover:bg-primary has-[.active]:bg-primary has-[.active]:text-background transition-colors cursor-pointer "
              >
                <NavLink
                  to={link.link}
                  className={clsx(
                    "flex items-center gap-5 h-full w-full py-6",
                    isSideMenuOpened ? " px-12" : "justify-center"
                  )}
                >
                  {<link.icon className="inline-block" />}
                  {isSideMenuOpened && <span>{link.Label}</span>}
                </NavLink>
                {!isSideMenuOpened && (
                  <span className=" pointer-events-none inline-block rounded-lg absolute top-1/2 left-full -translate-y-1/2 text-nowrap bg-primary z-[99999999999] text-background text-large p-2 ml-5 before:absolute before:w-0 before:h-0 before:border-primary before:border-4 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:top-1/2 before:-translate-y-1/2 before:-left-3 translate-x-14 opacity-0 group-hover/label:opacity-100 group-hover/label:translate-x-0 transition-all duration-500 ease-in-out  ">
                    {link.Label}
                  </span>
                )}
              </li>
            ))}
            <li
              className={clsx(
                "hover:text-background hover:bg-primary transition-colors cursor-pointer flex items-center gap-5 py-6",
                isSideMenuOpened ? "px-12" : "justify-center"
              )}
              onClick={logout}
            >
              {<Icons.Logout className="inline-block" />}
              {isSideMenuOpened && <span>logout</span>}
            </li>
          </ul>
        </nav>
      </aside>
      <main className="h-full overflow-y-auto overflow-x-hidden p-8 relative">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
