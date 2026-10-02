export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'ngo' | 'admin';
  city?: string;
  state?: string;
  created_at?: string;
}

export interface UserVerification {
  id?: string;
  full_name: string;
  fullName?: string;
  id_type: 'Aadhaar' | 'PAN' | 'Voter ID' | 'Driving License';
  id_number: string;
  idNumber?: string;
  phone: string;
  email: string;
  city: string;
  verified_at?: string;
}

export interface NGO {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'Hunger Relief' | 'Education' | 'Healthcare' | 'Environment' | 'Animal Welfare' | 'Disaster Relief' | 'Rural Development' | 'Women Empowerment' | 'Child Welfare' | 'Agriculture';
  causes?: string[];
  location: string;
  state?: string;
  district?: string;
  city?: string;
  public_address?: string;
  website?: string;
  logo_url: string;
  banner_url: string;
  verified: boolean;
  verification_status?: 'pending_review' | 'under_review' | 'platform_verified' | 'rejected';
  transparency_score: number; // 0 - 100
  founded_year: number;
  reg_number: string;
  organization_type?: 'Trust' | 'Society' | 'Section 8 Company' | 'NGO' | 'Other';
  renewal_status?: 'Active' | 'Renewal Due' | 'Expired' | 'Not Applicable';
  last_renewal_date?: string;
  registration_authority?: string;
  latitude?: number;
  longitude?: number;
  active_campaigns_count?: number;
  volunteers_needed_count?: number;
  people_reached_count?: number;
  created_at?: string;
}

export interface NGORegistrationSubmission {
  id: string;
  organization_name?: string;
  name?: string;
  organization_type?: string;
  category?: string;
  email?: string;
  official_email?: string;
  mobile?: string;
  website?: string;
  official_address?: string;
  state?: string;
  district?: string;
  city?: string;
  pin_code?: string;
  registration_number?: string;
  reg_number?: string;
  registration_date?: string;
  renewal_status?: string;
  last_renewal_date?: string;
  registration_authority?: string;
  pan_number?: string;
  pan_incorporation_date?: string;
  annual_budget?: number;
  head_officer_name?: string;
  head_officer_phone?: string;
  audit_report_url?: string;
  past_event_proof_url?: string;
  video_proof_url?: string;
  documents?: { name: string; type: string; uploadedAt: string }[];
  office_bearers_count?: number;
  office_bearers?: { name: string; designation: string }[];
  latitude?: number;
  longitude?: number;
  causes?: string[];
  status: 'pending_review' | 'under_review' | 'platform_verified' | 'rejected' | 'verified' | 'pending';
  submitted_at?: string;
}

export interface StateImpactData {
  state: string;
  ngoCount: number;
  verifiedNgoCount: number;
  volunteerCount: number;
  activeCampaigns: number;
  peopleReached: number;
  fundsRaised: string;
  causes: string[];
  districts?: string[];
  center: [number, number]; // [lat, lng] for map centering
}

export interface Post {
  id: string;
  ngo_id: string;
  ngo?: NGO;
  title: string;
  content: string;
  media_url?: string;
  activity_type: 'past_impact' | 'upcoming_event' | 'story';
  event_date: string;
  location: string;
  people_reached: number;
  metrics_label: string;
  likes_count: number;
  created_at: string;
}

export interface Fundraiser {
  id: string;
  ngo_id: string;
  ngo?: NGO;
  title: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  unit_cost_description: string;
  status: 'active' | 'completed';
  deadline: string;
  image_url: string;
  created_at?: string;
}

export interface VolunteerNeed {
  id: string;
  ngo_id: string;
  ngo?: NGO;
  title: string;
  description: string;
  skills_required: string[];
  location: string;
  event_date: string;
  total_slots: number;
  filled_slots: number;
  status: 'open' | 'filled';
  created_at?: string;
}

export interface Donation {
  id: string;
  fundraiser_id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  is_anonymous: boolean;
  receipt_id: string;
  created_at: string;
}

export interface VolunteerApplication {
  id: string;
  volunteer_need_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  skills?: string;
  status: 'pending' | 'approved';
  created_at: string;
}

export interface AIImpactAnalysis {
  activity: string;
  location: string;
  beneficiaries: string;
  volunteers: string;
  resources: string;
  impact_summary: string;
}
