import { Mail, MapPin, Phone } from 'lucide-react'
import { BrandMark } from './Navbar'
import { CONTACT, FOOTER_SERVICES, NAV_LINKS, SOCIALS } from './content'
import { Container, CtaLink, Stagger, StaggerItem, scrollToHash } from './ui'

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="text-xs font-extrabold tracking-[0.2em] text-lpo-navy uppercase">
      {children}
    </p>
  )
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        scrollToHash(href)
      }}
      className="group relative inline-block text-sm text-muted-foreground transition-colors hover:text-lpo-ink"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-lpo-yellow transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-lpo-surface">
      <Container className="py-16">
        <Stagger className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr]" stagger={0.1}>
          <StaggerItem>
            <BrandMark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Helping businesses generate opportunities, execute outreach, and build
              reliable support operations.
            </p>
            <span className="mt-5 inline-flex rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-lpo-blue uppercase">
              Leave the work to us!
            </span>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-bold text-lpo-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-lpo-blue hover:text-lpo-blue"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <FooterHeading>Navigation</FooterHeading>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <FooterLink href={`#${link.id}`}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <FooterHeading>Services</FooterHeading>
            <ul className="mt-5 space-y-3">
              {FOOTER_SERVICES.map((s) => (
                <li key={s.label}>
                  <FooterLink href={s.href}>{s.label}</FooterLink>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 transition-colors hover:text-lpo-ink">
                  <Mail className="size-4 text-lpo-blue" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 transition-colors hover:text-lpo-ink">
                  <Phone className="size-4 text-lpo-blue" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-lpo-blue" />
                {CONTACT.location}
              </li>
            </ul>
            <CtaLink to="/get-started" size="sm" arrow={false} className="mt-6">
              Get Started
            </CtaLink>
          </StaggerItem>
        </Stagger>
      </Container>

      <div className="bg-lpo-navy">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Laguna Personnel Outsourcing. All rights reserved.</p>
          <p className="font-semibold tracking-wide text-lpo-yellow">Leave the work to us.</p>
        </Container>
      </div>
    </footer>
  )
}
