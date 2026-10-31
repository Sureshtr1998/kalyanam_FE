import { Suspense, useEffect, type ReactNode } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Activity as ActivityIcon,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "@/components/common/Brand";
import { OmSpinner } from "@/components/common/Loaders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/context/UserContext";
import { getSession, isBroker, signOut } from "@/lib/session";
import { cn } from "@/lib/utils";
import { imageUrl } from "@/utils/constants";
import { getInitials } from "@/utils/utils";

const userNav = [
  { to: "/home", label: "Matches", icon: Users },
  { to: "/activity", label: "Activity", icon: ActivityIcon },
  { to: "/astrology", label: "Astrology", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/account", label: "Account", icon: Settings },
];

const brokerNav = [
  { to: "/partner", label: "My Members", icon: Users },
  { to: "/matchmaker-profile", label: "My Agency", icon: BriefcaseBusiness },
];

const adminLink = { to: "/admin", label: "Admin", icon: ShieldCheck };
const brokerPaths = brokerNav.map((n) => n.to);

const Shell = ({ children }: { children: ReactNode }) => {
  const { user, loaded, remaining } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const broker = isBroker();
  // Admins use the site as a normal member, plus the admin panel (desktop nav and menu).
  const nav = broker ? brokerNav : user.isAdmin ? [...userNav, adminLink] : userNav;
  const tabBarNav = broker ? brokerNav : userNav;
  const name = user.basic?.fullName || getSession()?.fullName || "";
  const photo = user.basic?.images?.[0]?.url;

  // Partners only have their own pages.
  useEffect(() => {
    if (broker && !brokerPaths.includes(location.pathname)) navigate("/partner", { replace: true });
  }, [broker, location.pathname, navigate]);

  // New members must finish their profile before browsing others.
  useEffect(() => {
    if (
      loaded &&
      !broker &&
      user._id &&
      !user.hasCompleteProfile &&
      location.pathname !== "/profile"
    ) {
      navigate("/profile", { replace: true });
    }
  }, [loaded, broker, user._id, user.hasCompleteProfile, location.pathname, navigate]);

  // Partner pages are for partners only; redirect before they mount and call partner APIs.
  if (!broker && brokerPaths.includes(location.pathname)) return <Navigate to="/home" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Brand to={broker ? "/partner" : "/home"} compact />

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary/8 text-primary hover:bg-primary/10 hover:text-primary",
                    // No room for a sixth link until xl; it's always in the avatar menu.
                    to === adminLink.to && "hidden xl:flex"
                  )
                }>
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {!broker && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/account"
                    className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-gold/20">
                    <Heart className="size-4 fill-primary text-primary" />
                    {remaining}
                    <span className="hidden font-medium sm:inline">credits</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Credits left: 1 per interest, 5 to see a contact now · tap to buy more</TooltipContent>
              </Tooltip>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open account menu">
                <Avatar className="size-10 ring-2 ring-gold/50">
                  {photo && <AvatarImage src={imageUrl(photo, "thumb")} alt="" className="object-cover" />}
                  <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-semibold">{name || "Welcome"}</p>
                  {user.basic?.uniqueId && (
                    <p className="text-xs text-muted-foreground">ID · {user.basic.uniqueId}</p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {nav.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to} onSelect={() => navigate(to)}>
                    <Icon />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={signOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:pb-12">
        {children}
      </main>

      <footer className="hidden border-t border-border/70 py-6 text-center text-xs text-muted-foreground lg:block">
        © {new Date().getFullYear()} Seetha Rama Kalyana · Dedicated to finding your match ·{" "}
        <Link to="/faq" className="underline-offset-2 hover:underline">
          Help
        </Link>
      </footer>

      {/* Mobile / tablet tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Primary">
        <div className="mx-auto flex max-w-xl">
          {tabBarNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )
              }>
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      isActive && "bg-primary/10"
                    )}>
                    <Icon className="size-5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

const AppLayout = () => (
  <UserProvider>
    <Shell>
      <Suspense
            fallback={
              <div className="flex min-h-[50dvh] items-center justify-center">
                <OmSpinner />
              </div>
            }>
            <Outlet />
          </Suspense>
    </Shell>
  </UserProvider>
);

export default AppLayout;
