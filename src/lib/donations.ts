import { supabase } from "@/integrations/supabase/client";

export interface Donation {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "success" | "failed";
  payment_id: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DonationWithProfile extends Donation {
  profiles?: {
    email: string;
    full_name: string | null;
    phone: string | null;
  };
}

export const createDonation = async (
  userId: string,
  amount: number,
  notes?: string
) => {
  const { data, error } = await supabase
    .from("donations")
    .insert({
      user_id: userId,
      amount,
      notes,
      status: "pending",
    })
    .select()
    .single();

  return { data, error };
};

export const updateDonationStatus = async (
  donationId: string,
  status: "pending" | "success" | "failed",
  paymentId?: string
) => {
  const { data, error } = await supabase
    .from("donations")
    .update({
      status,
      payment_id: paymentId,
    })
    .eq("id", donationId)
    .select()
    .single();

  return { data, error };
};

export const getUserDonations = async (userId: string) => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: data as Donation[] | null, error };
};

export const getAllDonations = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select(`
      *,
      profiles (
        email,
        full_name,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  return { data: data as DonationWithProfile[] | null, error };
};

export const getDonationStats = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select("amount, status");

  if (error || !data) {
    return { totalAmount: 0, successfulDonations: 0, pendingDonations: 0, failedDonations: 0 };
  }

  const successfulDonations = data.filter(d => d.status === "success");
  const pendingDonations = data.filter(d => d.status === "pending");
  const failedDonations = data.filter(d => d.status === "failed");

  return {
    totalAmount: successfulDonations.reduce((sum, d) => sum + Number(d.amount), 0),
    successfulDonations: successfulDonations.length,
    pendingDonations: pendingDonations.length,
    failedDonations: failedDonations.length,
  };
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};
