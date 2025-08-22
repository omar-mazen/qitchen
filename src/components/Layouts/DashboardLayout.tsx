import { Link, NavLink, Outlet } from "react-router";

import texture from "@images/texture.png";
import Logo from "@icons/logo.svg?react";
import { DASHBOARD } from "@/constants/routes";
import { useAuth } from "@/context/Auth";

const links = [
  { Label: "home", link: DASHBOARD.HOME },
  { Label: "orders", link: DASHBOARD.ORDERS },
  { Label: "menu management", link: DASHBOARD.MENU_MANAGEMENT },
  { Label: "tables", link: DASHBOARD.TABLES },
  { Label: "reservation", link: DASHBOARD.RESERVATION },
];
export const DashboardLayout = () => {
  const { logout } = useAuth();
  return (
    <div
      style={{ background: `url(${texture})` }}
      className={`h-full w-full backdrop-brightness-150 rounded-2xl overflow-hidden grid grid-cols-[300px_1fr] border border-border divide-border divide-x`}
    >
      <aside>
        <Link to={DASHBOARD.HOME}>
          <Logo className="mx-auto py-8 border-b border-border w-full !box-content" />
        </Link>
        <nav>
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li
                key={`nav ${link.Label} link`}
                className="hover:text-background hover:bg-primary has-[.active]:bg-primary has-[.active]:text-background transition-colors cursor-pointer "
              >
                <NavLink
                  to={link.link}
                  className="block h-full w-full px-12 py-6"
                >
                  {link.Label}
                </NavLink>
              </li>
            ))}
            <li
              className="hover:text-background hover:bg-primary transition-colors cursor-pointer px-12 py-6"
              onClick={logout}
            >
              logout
            </li>
          </ul>
        </nav>
      </aside>
      <main className="h-full overflow-y-auto overflow-x-hidden p-8 relative">
        <Outlet />
      </main>
    </div>
  );
};
