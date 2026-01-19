import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { createDonation, updateDonationStatus } from "@/lib/donations";
import { Heart, CreditCard, IndianRupee } from "lucide-react";

interface DonationFormProps {
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export const DonationForm = ({ onSuccess }: DonationFormProps) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentSim, setShowPaymentSim] = useState(false);
  const [pendingDonationId, setPendingDonationId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const handleAmountPreset = (preset: number) => {
    setAmount(preset.toString());
  };

  const handleInitiateDonation = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a donation",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Create donation record with pending status
    const { data, error } = await createDonation(user.id, amountNum, notes);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to initiate donation. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    setPendingDonationId(data.id);
    setShowPaymentSim(true);
    setIsProcessing(false);
  };

  const simulatePayment = async (success: boolean) => {
    if (!pendingDonationId) return;

    setIsProcessing(true);
    const status = success ? "success" : "failed";
    const paymentId = success ? `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null;

    const { error } = await updateDonationStatus(pendingDonationId, status, paymentId || undefined);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update donation status",
        variant: "destructive",
      });
    } else {
      toast({
        title: success ? "Payment Successful!" : "Payment Failed",
        description: success 
          ? `Thank you for your generous donation of ₹${amount}!`
          : "Your payment could not be processed. Please try again.",
        variant: success ? "default" : "destructive",
      });

      if (success) {
        setAmount("");
        setNotes("");
        onSuccess();
      }
    }

    setShowPaymentSim(false);
    setPendingDonationId(null);
    setIsProcessing(false);
  };

  if (showPaymentSim) {
    return (
      <Card className="border-2 border-foreground shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway (Sandbox)
          </CardTitle>
          <CardDescription>
            Simulated payment for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary p-6 border-2 border-foreground text-center">
            <p className="text-lg font-medium mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold flex items-center justify-center">
              <IndianRupee className="h-8 w-8" />
              {amount}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input placeholder="4111 1111 1111 1111" disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input placeholder="12/25" disabled />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" disabled />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-foreground pt-4">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Simulate payment result:
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => simulatePayment(true)} 
                className="flex-1"
                disabled={isProcessing}
              >
                Simulate Success
              </Button>
              <Button 
                onClick={() => simulatePayment(false)} 
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Simulate Failure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-foreground shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <Heart className="h-5 w-5" /> */}
          Make a Donation
        </CardTitle>
        <CardDescription>
          Your contribution helps us make a difference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Quick Select Amount</Label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset.toString() ? "default" : "outline"}
                onClick={() => handleAmountPreset(preset)}
                className="flex items-center gap-1"
              >
                <IndianRupee className="h-3 w-3" />
                {preset}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Custom Amount (₹)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              min="1"
              placeholder="Enter amount"
              className="pl-10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Message (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Leave a message with your donation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleInitiateDonation} 
          className="w-full" 
          size="lg"
          disabled={isProcessing || !amount}
        >
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </Button>
      </CardContent>
    </Card>
  );
};
