import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Member } from "@/types/gym";
import { MemberTable } from "@/components/members/MemberTable";
import { MemberDialog } from "@/components/members/MemberDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { mockMembers } from "@/data/mockData";

export default function Members() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: members = mockMembers } = useQuery({
    queryKey: ["members"],
    queryFn: api.getMembers,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const saveMemberMutation = useMutation({
    mutationFn: (memberData: Partial<Member>) => {
      if (memberData.id) {
        return api.updateMember(memberData.id, memberData);
      }
      return api.createMember(memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => api.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    deleteMemberMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Member deleted",
          description: "The member has been removed from the system.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error deleting member",
          description: error?.message ?? "Something went wrong.",
        });
      },
    });
  };

  const handleSaveMember = (memberData: Partial<Member>) => {
    const payload: Partial<Member> = {
      ...memberData,
      subscriptionStart:
        memberData.subscriptionStart ??
        format(new Date(), "yyyy-MM-dd"),
    };

    saveMemberMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: memberData.id ? "Member updated" : "Member added",
          description: memberData.id
            ? "The member details have been updated."
            : "New member has been added to the system.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error saving member",
          description: error?.message ?? "Something went wrong.",
        });
      },
    });
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

