import Link from "next/link"
import Image from "next/image"
import { Shield, Smartphone, Map, ArrowRight, Locate, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import LandingNav from "@/components/Nav/LandingNav"
import LandingFooter from "@/components/LandingFooter"
import Squares from "@/components/animations/squares"

export default function LandingPage() {
  return (
    <div>
      <LandingNav />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className=" px-4 md:px-12">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Property in Real-Time
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Never lose track of your valuables again. Our GPS-powered system lets students monitor their
                    property location on a live map.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
                  <Image
                    src="/images/dashboard_snippet.png"
                    alt="Dashboard preview"
                    width={800}
                    height={500}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Keep Your Property Safe
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive tracking system combines hardware and software to give you peace of mind.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Locate className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Monitor your property&rsquo;s location in real-time with our GPS-powered tracking system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Interactive Map</h3>
                <p className="text-center text-muted-foreground">
                  View your property on an interactive map with detailed location history.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Theft Protection</h3>
                <p className="text-center text-muted-foreground">
                  Get instant alerts if your property moves outside of designated safe zones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How PropertyTracker Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system combines advanced hardware with an intuitive dashboard.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Register Your Device</h3>
                <p className="text-center text-muted-foreground">
                  Attach our compact GPS tracker to your valuable property and register it in our system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Connect to Network</h3>
                <p className="text-center text-muted-foreground">
                  Our SIM800L v2 module connects to cellular networks to transmit location data securely.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Track in Real-Time</h3>
                <p className="text-center text-muted-foreground">
                  Log into your dashboard to view your property&rsquo;s location in real-time on our interactive map.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-12">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-background shadow-xl">
                  <Image
                    src="/images/hardware.jpg"
                    alt="GPS Tracker Hardware"
                    width={500}
                    height={500}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Powered by Advanced Hardware</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our tracking system uses cutting-edge components to ensure reliable performance.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Locate className="h-5 w-5 text-primary" />
                    </div>
                    <span>
                      <strong>GPS Module:</strong> High-precision location tracking with global coverage
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Wifi className="h-5 w-5 text-primary" />
                    </div>
                    <span>
                      <strong>SIM800L v2:</strong> Reliable cellular connectivity for data transmission
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <span>
                      <strong>Arduino Nano:</strong> Efficient data processing and power management
                    </span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button>Get Your Tracker</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground relative">
          <div className="absolute inset-0 w-full h-full z-0">
            <Squares 
              speed={0.5} 
              squareSize={40}
              direction="diagonal"
              borderColor="rgba(255, 255, 255, 0.1)"
              hoverFillColor="rgba(0, 0, 0, 0.5)"
            />
          </div>
          <div className="px-4 relative z-10 w-fit mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Secure Your Property?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of students who trust PropertyTracker to keep their valuables safe.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="gap-1">
                    Sign Up Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 bg-primary hover:text-primary hover:bg-white"
                  >
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our property tracking system.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">How accurate is the GPS tracking?</h3>
                <p className="mt-2 text-muted-foreground">
                  Our GPS module provides location accuracy within 2-3 meters under optimal conditions.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">How long does the battery last?</h3>
                <p className="mt-2 text-muted-foreground">
                  The battery can last up to 7 days on a single charge with standard tracking settings.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">Is there a monthly subscription fee?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, we offer affordable monthly plans that include cellular connectivity and dashboard access.
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">Can I track multiple items?</h3>
                <p className="mt-2 text-muted-foreground">
                  You can register and track multiple devices from a single dashboard account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>

  )
}


