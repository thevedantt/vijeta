import Link from "next/link"
import { Zap, Github, Twitter, Linkedin, Instagram } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Discover", href: "/discover" },
    { label: "Team Up", href: "/team" },
    { label: "Showcase", href: "/showcase" },
    { label: "Guidance Library", href: "/discover" },
    { label: "AI Assistant", href: "/dashboard" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Winners Library", href: "/showcase" },
    { label: "Community", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
}

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-[#1F2430] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#5D7B3D] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Vijeta</span>
            </Link>
            <p className="text-[#8B93A7] text-sm leading-relaxed max-w-xs mb-6">
              The operating system for ambitious Indian students. Discover opportunities, build great teams, win competitions, and pay it forward.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#5D7B3D] flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-4 h-4 text-[#8B93A7] hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#8B93A7] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8B93A7]">
            © 2025 Vijeta. Built for ambitious Indian students. 🇮🇳
          </p>
          <p className="text-sm text-[#8B93A7]">
            Made with love in India
          </p>
        </div>
      </div>
    </footer>
  )
}
