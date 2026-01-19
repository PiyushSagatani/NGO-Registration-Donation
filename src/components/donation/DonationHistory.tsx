import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthContext } from "@/contexts/AuthContext";
import { getUserDonations, Donation } from "@/lib/donations";
import { History, IndianRupee, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

interface DonationHistoryProps {
  refreshTrigger?: number;
}

export const DonationHistory = ({ refreshTrigger }: DonationHistoryProps) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data } = await getUserDonations(user.id);
      setDonations(data || []);
      setLoading(false);
    };

    fetchDonations();
  }, [user, refreshTrigger]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-chart-2 text-primary-foreground gap-1">
            <CheckCircle className="h-3 w-3" />
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-foreground shadow-md">
        <CardContent className="py-8 text-center">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-foreground shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Donation History
        </CardTitle>
        <CardDescription>
          Track all your donations and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No donations yet. Make your first donation today!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {format(new Date(donation.created_at), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {Number(donation.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(donation.status)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {donation.payment_id || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
