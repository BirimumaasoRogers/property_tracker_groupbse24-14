import Link from "next/link"
import { MapPin, Mail, Phone, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LandingNav from "@/components/Nav/LandingNav"
import LandingFooter from "@/components/LandingFooter"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />

      <main className="flex-1 w-full">
        <section className="w-full py-12 px-4 sm:px-12 md:py-24">
          <div className="px-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Support</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    We're here to help with any questions or issues you may have with your property tracking system.
                  </p>
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Email Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <a href="mailto:support@propertytracker.com" className="text-primary hover:underline">
                          support@propertytracker.com
                        </a>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">Response time: Within 24 hours</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Phone Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <a href="tel:+256742887933" className="text-primary hover:underline">
                          +256 (742) 887 933
                        </a>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">Available Monday-Friday, 9am-5pm EST</p>
                    </CardContent>
                  </Card>
                  {/* <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Live Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <Link href="#" className="text-primary hover:underline">
                          Start a live chat session
                        </Link>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">Available 24/7 for urgent issues</p>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">Send us a message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-type">Issue Type</Label>
                      <Select>
                        <SelectTrigger id="issue-type">
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardware">Hardware Problem</SelectItem>
                          <SelectItem value="software">Software Problem</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device-id">Device ID (if applicable)</Label>
                      <Input id="device-id" placeholder="TRK-12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue in detail..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
