import AuthButton from "./AuthButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex h-20 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
      <div className="container flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Logo />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/order"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Orders
          </Link>
          <Link
            href="/inventory"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Products
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Analytics
          </Link>
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
