import { AlertTriangle, Phone } from "lucide-react";
import { Member, getPlanName } from "@/types/gym";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";

interface ExpiringMembersProps {
  members: Member[];
}

export function ExpiringMembers({ members }: ExpiringMembersProps) {
  const expiringMembers = members
    .filter(m => m.status === 'expiring_soon' || m.status === 'expired')
    .sort((a, b) => new Date(a.subscriptionEnd).getTime() - new Date(b.subscriptionEnd).getTime())
    .slice(0, 5);

  const handleWhatsAppNotify = (member: Member) => {
    const message = encodeURIComponent(
      `Hi ${member.name}, your gym subscription is ${member.status === 'expired' ? 'expired' : 'expiring soon'}. Please renew to continue enjoying our services!`
    );
    window.open(`https://wa.me/${member.phone.replace(/\s/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Expiring Soon
        </h3>
      </div>
      
      {expiringMembers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No members expiring soon
        </p>
      ) : (
        <div className="space-y-3">
          {expiringMembers.map((member) => {
            const daysLeft = differenceInDays(new Date(member.subscriptionEnd), new Date());
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Branch {member.branch}</span>
                    <span>•</span>
                    <span>{getPlanName(member.plan)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={member.status === 'expired' ? 'destructive' : 'outline'}
                    className={member.status === 'expiring_soon' ? 'border-warning text-warning' : ''}
                  >
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-success hover:text-success hover:bg-success/10"
                    onClick={() => handleWhatsAppNotify(member)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
