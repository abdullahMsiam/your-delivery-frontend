import Link from "next/link";
import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/shared/container";
import { Twitter, Facebook, Github, Linkedin } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/track", label: "Track parcel" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/register", label: "Get started" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Register" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Brand />
            <p className="text-sm text-muted-foreground max-w-xs">
              Fast, reliable parcel delivery. Track every step, pay securely,
              and get your parcels where they need to be.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link
                href="#"
                aria-label="Twitter"
                className="hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} Your Delivery. All rights reserved.
          </span>
          <span className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
