'use client'

import { Menu, Plus, Search, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserDropdown from "./profile";
import { useAuth } from "@/providers/user-provider";
import { useProfile } from "@/hooks/useProfiles";


interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode; 
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  menu?: MenuItem[];
  option?: {
    report: {
      title: string;
      url: string;
    },
    signIn: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/images/logo.png?v=1",
    alt: "logo findera",
  },
  menu = [
    { title: "Beranda", url: "/" },
    { title: "Tentang Kami", url: "/tentang-kami" },
    { title: "Cara Kerja", url: "/cara-kerja" },
  ],
  option = {
    report: { 
      title: "Buat Laporan", url: "/akun/buat-laporan"
     },
    signIn: {
      title: "Masuk", url: "/sign-in",
    }
  },
}: NavbarProps) => {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const searchParam = params.get("search") || ""
  const [open, setOpen] = useState(false)

  const { data: profile } = useProfile()

  useEffect(() => {
    setSearch(searchParam)
  }, [searchParam])

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()

    const p = new URLSearchParams(params.toString())

    if (search.trim()) {
      p.set("search", search.trim())
    } else {
      p.delete("search")
    }

    p.set("page", "1")

    router.push(`/?${p.toString()}`)
  }

  return (
    <section className="sticky top-0 z-50 bg-white py-3 md:py-2 px-5 md:px-14 border-b shadow-sm">
      <div className="container-fluid">
        <nav className="hidden lg:flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full">
            <Link href={logo.url} className="flex items-center gap-2 shrink-0">
              <Image src={logo.src} width={0} height={0} sizes="100vw" className="h-12 w-auto" alt={logo.alt} />
            </Link>
            <div className="relative w-full ps-2">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item, pathname))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <form onSubmit={handleSearch} className="relative w-full ps-2 py-3">
                <span className="absolute inset-y-0 start-4 flex items-center text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(e)
                  }}
                  placeholder="Cari barang hilang atau ditemukan..."
                  className="bg-white w-full h-10 shadow-sm py-2 ps-8 pe-4 text-sm focus:outline-none"
                />
            </form>
          </div>

          <div className="flex items-center gap-3 w-1/3 justify-end">
            <Button className="px-5" asChild size="default">
              <Link className="group" href={option.report.url}>
                <Plus /> {option.report.title}
              </Link>
            </Button>
            {profile ? (
              <UserDropdown />
            ): (
              <Button className="px-5 border border-primary shadow-md " variant={'outline'} asChild size="default">
                <Link className="group" href={option.signIn.url}>
                  {option.signIn.title}
                </Link>
              </Button>
            )}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex justify-start items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button className="border-primary" variant="outline" size="icon">
                    <Menu className="size-4 text-primary" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <Image width={0} height={0} sizes="100vw" src={logo.src} className="max-h-12 w-auto" alt={logo.alt} />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item, pathname, setOpen))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      <form onSubmit={handleSearch} className="relative w-full">
                        <span className="absolute inset-y-0 start-4 pe-4 flex items-center text-gray-400">
                          <Search className="w-4 h-4" />
                        </span>
                        <Input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch(e)
                          }}
                          placeholder="Cari barang hilang atau ditemukan..."
                          className="w-full bg-white border-2 px-2 py-2 ps-10 text-sm focus:outline-none focus:ring-none"
                        />
                      </form>
                      <Button asChild>
                        <Link href={option.report.url}>{option.report.title}</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Link href={logo.url} className="flex items-center gap-2">
                <Image width={0} height={0} sizes="100vw" src={logo.src} className="max-h-12 w-auto" alt={logo.alt} />
              </Link>
            </div>
            {profile ? (
                <UserDropdown />
              ): (
                <Button className="px-5 border border-primary shadow-md " variant={'outline'} asChild size="default">
                  <Link className="group" href={option.signIn.url}>
                    {option.signIn.title}
                  </Link>
                </Button>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, pathname: string) => {
  const isActive = pathname === item.url

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link
        href={item.url}
        className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium 
          transition-colors hover:bg-muted hover:no-underline
          ${isActive ? "text-primary font-semibold" : ""}
        `}
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, pathname: string, setOpen: (v: boolean) => void) => {
  const isActive = pathname === item.url

  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              onClick={() => setOpen(false)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} onClick={() => setOpen(false)}
      className={`text-md font-semibold group transition-colors hover:no-underline
        ${isActive ? "text-primary font-semibold" : ""}`}>
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item, onClick }: { item: MenuItem, onClick?: () => void }) => {
  return (
    <Link
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url} onClick={onClick}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Navbar;