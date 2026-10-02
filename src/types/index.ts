export interface UserVerification {
  id: string;
  full_name: string;
  id_type: 'Aadhaar' | 'PAN' | 'Voter ID' | 'College ID' | 'Passport';
  id_number: string;
  phone: string;
  email: string;
  city: string;
  verified: boolean;
  registered_at: string;
}

export interface ExpenseAuditItem {
  id: string;
  category: string;
  description: string;
  vendor_name: string;
  invoice_no: string;
  amount_spent: number;
  receipt_url?: string;
  verified_by_auditor: boolean;
}

export interface BudgetReport {
  total_budget_allocated: number;
  total_spent: number;
  unspent_balance: number;
  expenses: ExpenseAuditItem[];
  financial_auditor_note?: string;
  report_document_url?: string;
}

export interface BeneficiaryRecord {
  id: string;
  name: string;
  age_or_grade: string;
  benefit_received: string;
  verification_status: 'Audited' | 'Verified On-Site';
}

export interface NGO {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'Hunger Relief' | 'Education' | 'Healthcare' | 'Environment' | 'Animal Welfare' | 'Disaster Relief';
  location: string;
  website?: string;
  logo_url: string;
  banner_url: string;
  verified: boolean;
  transparency_score: number; // 0 - 100
  founded_year: number;
  reg_number: string;
  pan_number?: string;
  darpan_id?: string;
  audit_certificate_url?: string;
  created_at?: string;
}

export interface Post {
  id: string;
  ngo_id: string;
  ngo?: NGO;
  title: string;
  content: string;
  media_url?: string;
  evidence_images?: string[];
  video_url?: string;
  activity_type: 'past_impact' | 'upcoming_event' | 'story';
  event_date: string;
  location: string;
  gps_coordinates?: string;
  people_reached: number;
  metrics_label: string;
  likes_count: number;
  beneficiary_records?: BeneficiaryRecord[];
  volunteers_attended?: string[];
  budget_report?: BudgetReport;
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
  budget_breakdown?: ExpenseAuditItem[];
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
  donor_pan_or_id?: string;
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
  applicant_id_proof?: string;
  skills?: string;
  status: 'pending' | 'approved';
  created_at: string;
}

export interface NGORegistrationSubmission {
  id: string;
  name: string;
  category: 'Hunger Relief' | 'Education' | 'Healthcare' | 'Environment' | 'Animal Welfare' | 'Disaster Relief';
  reg_number: string;
  pan_number: string;
  head_officer_name: string;
  head_officer_phone: string;
  official_email: string;
  city: string;
  website_or_social: string;
  audit_report_url: string;
  past_event_proof_url: string;
  video_proof_url?: string;
  annual_budget: number;
  status: 'pending_audit' | 'verified';
  submitted_at: string;
}
