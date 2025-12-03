import { useState } from "react";
import { Member, Branch, PlanType, getPlanName, BRANCHES, PLANS } from "@/types/gym";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Phone, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

interface MemberTableProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export function MemberTable({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
}: MemberTableProps) {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState<Branch | "all">("all");
  const [planFilter, setPlanFilter] = useState<PlanType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search);
    const matchesBranch = branchFilter === "all" || member.branch === branchFilter;
    const matchesPlan = planFilter === "all" || member.plan === planFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesBranch && matchesPlan && matchesStatus;
  });

  const handleWhatsApp = (member: Member) => {
    const message = encodeURIComponent(
      `Hi ${member.name}, this is a reminder about your gym subscription.`
    );
    window.open(`https://wa.me/${member.phone.replace(/\s/g, '')}?text=${message}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "expiring_soon":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Expiring Soon</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={branchFilter} onValueChange={(v) => setBranchFilter(v as Branch | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {BRANCHES.map((branch) => (
              <SelectItem key={branch} value={branch}>
                Branch {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanType | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {PLANS.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddMember} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{member.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Branch {member.branch}</Badge>
                  </TableCell>
                  <TableCell>{getPlanName(member.plan)}</TableCell>
                  <TableCell>{format(new Date(member.subscriptionEnd), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        onClick={() => handleWhatsApp(member)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
