import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { LogosBar } from "@/components/logos-bar"
import { ProblemSolution } from "@/components/problem-solution"
import { Features } from "@/components/features"
import { StatsBar } from "@/components/stats-bar"
import { SocialProof } from "@/components/social-proof"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { FloatingCTA } from "@/components/floating-cta"

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar />
            <Hero />
            <LogosBar />
            <ProblemSolution />
            <Features />
            <StatsBar />
            <SocialProof />
            <HowItWorks />
            <Pricing />
            <FinalCTA />
            <Footer />
            <FloatingCTA />
        </main>
    )
}
