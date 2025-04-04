import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export default function NotificationSettings() {
    return (
        <div className="space-y-6 px-4">
            <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications about your tracked devices.
                </p>
            </div>
            <Separator />
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <div className="flex items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <span>Device Movement Alerts</span>
                            <span className="text-sm text-muted-foreground">
                                Receive alerts when your device moves outside of safe zones.
                            </span>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <span>Low Battery Warnings</span>
                            <span className="text-sm text-muted-foreground">
                                Get notified when your device battery is running low.
                            </span>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <span>Weekly Summary</span>
                            <span className="text-sm text-muted-foreground">
                                Receive a weekly summary of your device activity.
                            </span>
                        </div>
                        <Switch />
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">SMS Notifications</h4>
                    <div className="flex items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <span>Emergency Alerts</span>
                            <span className="text-sm text-muted-foreground">
                                Receive SMS alerts for critical events like theft detection.
                            </span>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-y-0">
                        <div className="flex flex-col">
                            <span>Device Offline Alerts</span>
                            <span className="text-sm text-muted-foreground">Get notified when your device goes offline.</span>
                        </div>
                        <Switch />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                </div>
            </div>
        </div>
    )
}