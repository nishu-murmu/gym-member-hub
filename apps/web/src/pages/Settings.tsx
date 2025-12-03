import { Bell, Building, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS, BRANCHES } from "@/types/gym";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your gym management system.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure WhatsApp notification settings for subscription reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-send expiry reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically notify members before subscription expires
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div>
              <Label htmlFor="reminder-days">Days before expiry</Label>
              <Input
                id="reminder-days"
                type="number"
                defaultValue={7}
                className="mt-1.5 w-24"
              />
            </div>
            <div>
              <Label htmlFor="message-template">Message Template</Label>
              <textarea
                id="message-template"
                className="mt-1.5 w-full min-h-[100px] rounded-lg border bg-background px-3 py-2 text-sm"
                defaultValue="Hi {name}, your gym subscription is expiring on {date}. Please renew to continue enjoying our services!"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branch Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Branches
            </CardTitle>
            <CardDescription>
              Manage your gym branches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {BRANCHES.map((branch) => (
              <div
                key={branch}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">Branch {branch}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Subscription Plans
            </CardTitle>
            <CardDescription>
              Configure pricing for different subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <p className="font-semibold text-lg">{plan.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {plan.duration} month{plan.duration > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      defaultValue={plan.price}
                      className="h-9"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
