import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  description?: string;
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = async ({
  logo = {
    src: "/images/logo.png",
    alt: "logo exploreease",
    url: "/",
  },
  description = "Peta barang hilang dan ditemukan berbasis lokasi. Laporkan, temukan, dan klaim barang dengan cepat menggunakan map real-time. Aman, cerdas, dan berbasis komunitas.",
  bottomLinks = [
    { text: "Terms & Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
    { text: "Support Center", url: "#" },
  ],
}: FooterProps) => {

  return (
    <section className="pt-14 pb-2 px-5 md:px-14 bg-[#EEF3FF]">
      <div className="container">
        <footer>
          <div className="flex justify-center text-center">
            <div className="text-center w-full md:w-1/2 mb-8 lg:mb-0">
              <div className="flex justify-center items-center">
                <Link href={logo.url} className="shrink-0">
                  <Image
                    src={logo.src}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-18 w-auto"
                    alt={logo.alt}
                  />
                </Link>
              </div>
              <p className="mt-3 text-gray-600 font-normal mb-5">{description}</p>
              <ul className="social-media flex justify-center gap-2">
                <li className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-primary">
                  <Link className="group" href="#">
                    <Facebook className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-primary">
                  <Link className="group" href="#">
                    <Instagram className="w-5 h-5" />
                  </Link>
                </li>
                <li className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-primary">
                  <Link className="group" href="#">
                    <Youtube className="w-5 h-5" />
                  </Link>
                </li>
              </ul>

              <div className="mt-4 flex justify-center gap-4 text-[11px] md:text-[13px] text-gray-700">
                {bottomLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url}
                    className="hover:text-primary px-2 transition"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col text-center justify-center gap-2 border-t pt-3 text-[13px] text-gray-700 md:items-center">
            <p>© {new Date().getFullYear()} FindEra. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
