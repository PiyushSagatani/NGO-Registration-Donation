import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllDonations, getAllProfiles, getDonationStats, DonationWithProfile } from "@/lib/donations";
import { Profile } from "@/lib/auth";
import { format } from "date-fns";
import { 
  Users, 
  IndianRupee, 
  BarChart3, 
  Download, 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  UserCheck,
  CreditCard
} from "lucide-react";

const Admin = () => {
  const { user, loading, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  
  const [donations, setDonations] = useState<DonationWithProfile[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    successfulDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Filters
  const [donationSearch, setDonationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [profileSearch, setProfileSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    if (!loading && user && !isAdmin) {
      navigate("/dashboard");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setDataLoading(true);
      const [donationsRes, profilesRes, statsRes] = await Promise.all([
        getAllDonations(),
        getAllProfiles(),
        getDonationStats(),
      ]);

      setDonations(donationsRes.data || []);
      setProfiles((profilesRes.data || []) as Profile[]);
      setStats(statsRes);
      setDataLoading(false);
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

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

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      d.profiles?.email?.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.profiles?.full_name?.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.payment_id?.toLowerCase().includes(donationSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProfiles = profiles.filter((p) => {
    return (
      p.email.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.full_name?.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.phone?.includes(profileSearch)
    );
  });

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map((row) => 
      Object.values(row).map(v => 
        typeof v === "object" ? JSON.stringify(v) : v
      ).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || dataLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage registrations and donations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                  <p className="text-3xl font-bold">{profiles.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                  <p className="text-3xl font-bold flex items-center">
                    <IndianRupee className="h-6 w-6" />
                    {stats.totalAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-3xl font-bold text-chart-2">{stats.successfulDonations}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending / Failed</p>
                  <p className="text-3xl font-bold">
                    {stats.pendingDonations} / {stats.failedDonations}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donations" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="registrations" className="gap-2">
              <Users className="h-4 w-4" />
              Registrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card className="border-2 border-foreground shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Donation Records</CardTitle>
                    <CardDescription>View and manage all donations</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        className="pl-10 w-48"
                        value={donationSearch}
                        onChange={(e) => setDonationSearch(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => exportToCSV(filteredDonations, "donations")}
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No donations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            {format(new Date(donation.created_at), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {donation.profiles?.full_name || "-"}
                          </TableCell>
                          <TableCell>{donation.profiles?.email || "-"}</TableCell>
                          <TableCell className="font-medium flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {Number(donation.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(donation.status)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {donation.payment_id || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card className="border-2 border-foreground shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>View all registered supporters</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        className="pl-10 w-48"
                        value={profileSearch}
                        onChange={(e) => setProfileSearch(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => exportToCSV(filteredProfiles, "registrations")}
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No registrations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>
                            {format(new Date(profile.created_at), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {profile.full_name || "-"}
                          </TableCell>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>{profile.phone || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                              {profile.role}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
