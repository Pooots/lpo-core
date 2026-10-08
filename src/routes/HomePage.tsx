import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { Hero } from '@/components/home/Hero'
import { Navbar } from '@/components/home/Navbar'
import { Services, TrustStrip, WhyLpo } from '@/components/home/Services'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ColdOutreach, LeadGeneration } from '@/components/home/Outreach'
import { ItServiceDesk, VirtualAssistance } from '@/components/home/Support'
import {
  About,
  Faq,
  FinalCta,
  Industries,
  Testimonials,
} from '@/components/home/Company'
import { Footer } from '@/components/home/Footer'
import {
  BackToTop,
  Preloader,
  ScrollProgress,
} from '@/components/home/PageEffects'
import {
  INTRO_DURATION,
  INTRO_SEEN_KEY,
  IntroDelayContext,
} from '@/components/home/ui'

export default function HomePage() {
  const [showIntro] = useState(
    () => sessionStorage.getItem(INTRO_SEEN_KEY) !== '1',
  )

  return (
    <MotionConfig reducedMotion="user">
      <IntroDelayContext.Provider value={showIntro ? INTRO_DURATION : 0}>
        <Preloader show={showIntro} />
        <ScrollProgress />
        <Navbar />
        <main className="text-lpo-ink">
          <Hero />
          <TrustStrip />
          <Services />
          <WhyLpo />
          <HowItWorks />
          <LeadGeneration />
          <ColdOutreach />
          <VirtualAssistance />
          <ItServiceDesk />
          <Industries />
          <About />
          <Testimonials />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <BackToTop />
      </IntroDelayContext.Provider>
    </MotionConfig>
  )
}
