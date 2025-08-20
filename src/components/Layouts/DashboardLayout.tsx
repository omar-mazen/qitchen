import { Link, NavLink, Outlet } from "react-router";

import texture from "@images/texture.png";
import Logo from "@icons/logo.svg?react";
import { DASHBOARD } from "@/constants/routes";

const links = [
  { Label: "home", link: DASHBOARD.HOME },
  { Label: "orders", link: DASHBOARD.ORDERS },
  { Label: "products", link: DASHBOARD.PRODUCTS },
  { Label: "tables", link: DASHBOARD.TABLES },
  { Label: "reservation", link: DASHBOARD.RESERVATION },
];
export const DashboardLayout = () => {
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
            <li className="hover:text-background hover:bg-primary transition-colors cursor-pointer px-12 py-6">
              logout
            </li>
          </ul>
        </nav>
      </aside>
      <main className="h-full overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
