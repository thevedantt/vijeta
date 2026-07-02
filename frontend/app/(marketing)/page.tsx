import { Hero } from "@/components/landing/Hero"
import { TrustedBy } from "@/components/landing/TrustedBy"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { Flywheel } from "@/components/landing/Flywheel"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ShowcaseSection } from "@/components/landing/ShowcaseSection"
import { AISection } from "@/components/landing/AISection"
import { Testimonials } from "@/components/landing/Testimonials"
import { StatsSection } from "@/components/landing/StatsSection"
import { FAQ } from "@/components/landing/FAQ"
import { CTASection } from "@/components/landing/CTASection"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ProblemSection />
      <Flywheel />
      <FeaturesSection />
      <ShowcaseSection />
      <AISection />
      <Testimonials />
      <StatsSection />
      <FAQ />
      <CTASection />
    </>
  )
}
