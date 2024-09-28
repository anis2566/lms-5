import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { navs } from "@/constant";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export const Drawer = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[250px]">
        <SheetHeader>
          <SheetTitle className="-mt-3 flex items-center">
            <Logo callbackUrl="/" />
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <div className="mt-6 flex flex-col gap-2">
            {navs.map((nav) => (
              <SheetClose asChild key={nav.href}>
                <Link
                  href={nav.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex justify-start text-base",
                    pathname === nav.href && "bg-accent",
                  )}
                >
                  {nav.title}
                </Link>
              </SheetClose>
            ))}
          </div>
          <SheetFooter className="flex-col items-start justify-start sm:flex-col">
            <Separator className="mb-2" />
            <ModeToggle />
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
