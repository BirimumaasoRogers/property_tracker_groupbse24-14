"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Search,
  Smartphone,
  Monitor,
  Battery,
  Wifi,
  Map,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Home,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter function for FAQs
  const filterFAQs = (faqs: any, query: any) => {
    if (!query) return faqs

    return faqs.filter(
      (faq: any) =>
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Hardware FAQs
  const hardwareFAQs = [
    {
      id: "hw1",
      question: "How do I set up my tracking device for the first time?",
      answer:
        "To set up your tracker: 1) Connect the GPS module (GY-NEO6MV2), SIM800L module, and Arduino as per the wiring guide. 2) Insert a valid SIM card into the SIM800L. 3) Power the Arduino using a USB cable or external 9V power. 4) Wait for the SIM800L LED to blink slowly, indicating a network connection. 5) Log into the web dashboard, go to 'Register Item', and enter the Tracker ID displayed on the module. 6) Once registered, the tracker will start transmitting location data automatically to ThingSpeak.",
      category: "hardware",
    },
    {
      id: "hw2",
      question: "How long does the power supply last?",
      answer:
        "Battery life depends on your power source. Using a 2000mAh rechargeable battery and updates every 10–15 minutes, you can expect about 1–2 days of usage. For longer duration, consider connecting to a larger battery pack or a constant power supply. Make sure to recharge frequently if used portably.",
      category: "hardware",
    },
    {
      id: "hw3",
      question: "What should I do if the tracker isn't sending updates?",
      answer:
        "If your device stops updating: 1) Check if the Arduino and SIM800L are powered on. 2) Make sure your SIM card has data and sufficient balance. 3) Verify network coverage in your area. 4) Ensure your wiring is intact and securely connected. 5) Restart the Arduino and observe the LED on the SIM800L. If the issue continues, check the serial monitor for debugging or contact support.",
      category: "hardware",
    },
    {
      id: "hw4",
      question: "How do I attach the tracker to my property?",
      answer:
        "Secure the tracker inside your item using double-sided tape, cable ties, or a protective pouch. Ensure the GPS module has a clear path to the sky for optimal reception—do not enclose it inside a metallic or sealed container. For bags, place the tracker in a front-facing or top pouch.",
      category: "hardware",
    },
    {
      id: "hw5",
      question: "Is the tracker weather-resistant?",
      answer:
        "Currently, the tracker is not waterproof. To protect it, avoid exposure to rain or dust. You can enclose the components in a waterproof electronics enclosure if you plan to use the tracker in outdoor environments.",
      category: "hardware",
    },
    {
      id: "hw6",
      question: "How accurate is the GPS tracking?",
      answer:
        "The GPS module typically provides 2–3 meter accuracy in open sky environments. In areas with buildings or tree cover, accuracy may reduce to 5–15 meters. The system uses GPS only (no Wi-Fi or cellular triangulation).",
      category: "hardware",
    },
    {
      id: "hw7",
      question: "Can I replace or upgrade the SIM card?",
      answer:
        "Yes. You may replace the SIM card in the SIM800L module, but ensure it has data and supports 2G (GPRS) networks. Insert the SIM gently and power the device off before doing so. Improper handling may damage the SIM slot or compromise performance.",
      category: "hardware",
    },
  ];

  // Software FAQs
  const softwareFAQs = [
    {
      id: "sw1",
      question: "How do I create a geofence for my item?",
      answer:
        "You can set up a geofence when registering a new item: 1) Go to 'Register Item' on the dashboard. 2) Enter item details such as name, tracker ID, and contact info. 3) Use the map tool to draw a polygon (minimum 4 points) around the secure zone (e.g., hostel, lab). 4) Save the form. This defines the item's safe zone, and the system will start monitoring immediately.",
      category: "software",
    },
    {
      id: "sw2",
      question: "Can I view my item's movement history?",
      answer:
        "Yes. Go to your dashboard, click on a registered item, then select 'History'. You’ll see a list of previous locations plotted on the map along with timestamps pulled from the ThingSpeak log. Historical data is retained for analysis and theft investigations.",
      category: "software",
    },
    {
      id: "sw3",
      question: "How do I get notified when my item leaves the geofence?",
      answer:
        "The system will send an SMS alert to your registered phone number when an item exits its geofence. Alerts include the item name, time of breach, and last known location. You can also view alerts in your dashboard under 'Notifications'.",
      category: "software",
    },
    {
      id: "sw4",
      question: "How do I register multiple items?",
      answer:
        "To register more than one item: 1) Log into your dashboard. 2) Click 'Register Item' again and repeat the process with a new tracker ID. 3) You can create separate geofences and contacts per item. All registered items will appear in your dashboard.",
      category: "software",
    },
    {
      id: "sw5",
      question: "What happens if my item moves quickly out of the zone?",
      answer:
        "If rapid movement is detected, the system activates 'Chase Mode', sending more frequent GPS updates (e.g., every 30 seconds). This helps you track the theft or misplacement in near real-time. You can view this activity in the item’s details.",
      category: "software",
    },
    {
      id: "sw6",
      question: "Is my data safe?",
      answer:
        "Yes. All user data is stored securely in MongoDB with access protected via JWT-based authentication. Only you can access your device data. Ensure your password is strong, and avoid sharing your login credentials.",
      category: "software",
    },
    {
      id: "sw7",
      question: "Can I use the dashboard on my phone?",
      answer:
        "Absolutely. The dashboard is responsive and works on most modern mobile browsers. Just open https://your-geofencing-app.vercel.app in Safari or Chrome and log in as usual.",
      category: "software",
    },
    {
      id: "sw8",
      question: "Can I update my geofence after registration?",
      answer:
        "Yes. Navigate to the item on your dashboard, click 'Edit Geofence', and drag the existing polygon to the desired position or redraw it entirely. Click 'Save' to apply changes. The system will use the updated geofence immediately.",
      category: "software",
    },
  ];

  // Filter FAQs based on search query
  const filteredHardwareFAQs = filterFAQs(hardwareFAQs, searchQuery)
  const filteredSoftwareFAQs = filterFAQs(softwareFAQs, searchQuery)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-[#f6fff9]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <HelpCircle className="h-12 w-12 text-primary" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Help Center</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to common questions about your property tracking system
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for answers..."
                    className="w-full bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="w-full py-8">
          <div className="container px-4 md:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Hardware Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get help with your GPS tracker, battery issues, and device setup
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="#hardware" className="text-sm text-primary flex items-center">
                    View hardware FAQs <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Software Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn about the dashboard, maps, notifications, and account settings
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="#software" className="text-sm text-primary flex items-center">
                    View software FAQs <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Can&rsquo;t find what you&rsquo;re looking for? Our support team is here to help
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/contact" className="text-sm text-primary flex items-center">
                    Contact us <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Tabs */}
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="all">All Questions</TabsTrigger>
                <TabsTrigger value="hardware" id="hardware">
                  Hardware
                </TabsTrigger>
                <TabsTrigger value="software" id="software">
                  Software
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                {/* Hardware FAQs */}
                {filteredHardwareFAQs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">Hardware Questions</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredHardwareFAQs.map((faq: any) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                Hardware
                              </Badge>
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Software FAQs */}
                {filteredSoftwareFAQs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">Software Questions</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredSoftwareFAQs.map((faq: any) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                Software
                              </Badge>
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {filteredHardwareFAQs.length === 0 && filteredSoftwareFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="mt-2 text-muted-foreground">
                      We couldn&rsquo;t find any FAQs matching your search. Try different keywords or contact support.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hardware" className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">Hardware Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {filteredHardwareFAQs.map((faq: any) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Hardware
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredHardwareFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="mt-2 text-muted-foreground">
                      We couldn&rsquo;t find any hardware FAQs matching your search. Try different keywords or contact
                      support.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="software" className="space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">Software Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {filteredSoftwareFAQs.map((faq: any) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600">
                            Software
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredSoftwareFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No results found</h3>
                    <p className="mt-2 text-muted-foreground">
                      We couldn&rsquo;t find any software FAQs matching your search. Try different keywords or contact
                      support.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Topic Guides */}
        <section className="w-full py-8 md:py-12 bg-[#f6fff9]">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Popular Topics</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="#" className="group">
                <div className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Battery className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Battery Optimization</h3>
                      <p className="text-sm text-muted-foreground">Tips to extend battery life</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Wifi className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Connectivity Issues</h3>
                      <p className="text-sm text-muted-foreground">Troubleshooting guide</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Map className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Map Features</h3>
                      <p className="text-sm text-muted-foreground">Using the interactive map</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Privacy & Security</h3>
                      <p className="text-sm text-muted-foreground">Protecting your data</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Still Need Help?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our support team is available to assist you with any questions or issues.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild>
                  <Link href="/contact" target="blank">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:+256742887933">Call Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 px-4 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PropertyTracker. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/help" className="text-sm text-primary hover:underline underline-offset-4">
              Help Center
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
