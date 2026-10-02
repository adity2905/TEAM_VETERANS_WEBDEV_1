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
  created_at?: string;
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
