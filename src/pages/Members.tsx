import { useState } from "react";
import { Member } from "@/types/gym";
import { MemberTable } from "@/components/members/MemberTable";
import { MemberDialog } from "@/components/members/MemberDialog";
import { mockMembers } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { addMonths, format, differenceInDays } from "date-fns";

export default function Members() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleAddMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast({
      title: "Member deleted",
      description: "The member has been removed from the system.",
    });
  };

  const handleSaveMember = (memberData: Partial<Member>) => {
    const today = new Date();
    const expiryDate = new Date(memberData.subscriptionEnd!);
    const daysUntilExpiry = differenceInDays(expiryDate, today);
    
    let status: 'active' | 'expired' | 'expiring_soon' = 'active';
    if (daysUntilExpiry < 0) status = 'expired';
    else if (daysUntilExpiry <= 7) status = 'expiring_soon';

    if (memberData.id) {
      // Update existing member
      setMembers(
        members.map((m) =>
          m.id === memberData.id ? { ...m, ...memberData, status } as Member : m
        )
      );
      toast({
        title: "Member updated",
        description: "The member details have been updated.",
      });
    } else {
      // Add new member
      const newMember: Member = {
        id: `member-${Date.now()}`,
        name: memberData.name!,
        email: memberData.email!,
        phone: memberData.phone!,
        branch: memberData.branch!,
        plan: memberData.plan!,
        subscriptionStart: memberData.subscriptionStart!,
        subscriptionEnd: memberData.subscriptionEnd!,
        status,
        createdAt: format(new Date(), "yyyy-MM-dd"),
      };
      setMembers([newMember, ...members]);
      toast({
        title: "Member added",
        description: "New member has been added to the system.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground mt-1">
          Manage your gym members and their subscriptions.
        </p>
      </div>

      <MemberTable
        members={members}
        onAddMember={handleAddMember}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
      />

      <MemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveMember}
        member={editingMember}
      />
    </div>
  );
}
