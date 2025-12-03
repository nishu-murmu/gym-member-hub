import { useState, useEffect } from "react";
import { Member, Branch, PlanType, BRANCHES, PLANS } from "@/types/gym";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMonths, format } from "date-fns";

interface MemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: Partial<Member>) => void;
  member?: Member | null;
}

export function MemberDialog({ open, onClose, onSave, member }: MemberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "X" as Branch,
    plan: "1_month" as PlanType,
    subscriptionStart: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        branch: member.branch,
        plan: member.plan,
        subscriptionStart: member.subscriptionStart,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        branch: "X",
        plan: "1_month",
        subscriptionStart: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [member, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planDuration = PLANS.find(p => p.id === formData.plan)?.duration || 1;
    const subscriptionEnd = format(
      addMonths(new Date(formData.subscriptionStart), planDuration),
      "yyyy-MM-dd"
    );

    onSave({
      ...formData,
      subscriptionEnd,
      id: member?.id,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (with country code)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={formData.branch}
                onValueChange={(v) => setFormData({ ...formData, branch: v as Branch })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      Branch {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="plan">Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(v) => setFormData({ ...formData, plan: v as PlanType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLANS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="startDate">Subscription Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.subscriptionStart}
                onChange={(e) => setFormData({ ...formData, subscriptionStart: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{member ? "Update" : "Add"} Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
