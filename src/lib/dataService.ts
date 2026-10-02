import { NGO, Post, Fundraiser, VolunteerNeed, Donation, VolunteerApplication, User, StateImpactData, NGORegistrationSubmission } from '@/types';
import { INITIAL_NGOS, INITIAL_POSTS, INITIAL_FUNDRAISERS, INITIAL_VOLUNTEER_NEEDS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  NGOS: 'openseva_ngos',
  POSTS: 'openseva_posts',
  FUNDRAISERS: 'openseva_fundraisers',
  VOLUNTEER_NEEDS: 'openseva_volunteer_needs',
  DONATIONS: 'openseva_donations',
  APPLICATIONS: 'openseva_applications',
};

// Helper for local storage retrieval
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const DataService = {
  // --- NGOs ---
  async getNGOs(): Promise<NGO[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('ngos').select('*');
        if (!error && data && data.length > 0) return data as NGO[];
      } catch (e) {
        console.warn('Falling back to local data', e);
      }
    }
    return getLocalItem<NGO[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS);
  },

  async getNGOBySlug(slug: string): Promise<NGO | undefined> {
    const ngos = await this.getNGOs();
    return ngos.find((n) => n.slug === slug || n.id === slug);
  },

  // --- Posts / Activities ---
  async getPosts(): Promise<Post[]> {
    const ngos = await this.getNGOs();
    let posts: Post[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          posts = data as Post[];
        }
      } catch (e) {
        console.warn('Falling back to local posts', e);
      }
    }

    if (posts.length === 0) {
      posts = getLocalItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    }

    // Attach full NGO details for easy UI rendering
    return posts.map((post) => ({
      ...post,
      ngo: ngos.find((n) => n.id === post.ngo_id),
    }));
  },

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'likes_count'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('posts').insert([newPost]).select().single();
        if (!error && data) return data as Post;
      } catch (e) {
        console.error('Supabase post insert failed', e);
      }
    }

    const currentPosts = getLocalItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const updated = [newPost, ...currentPosts];
    setLocalItem(STORAGE_KEYS.POSTS, updated);
    return newPost;
  },

  async likePost(postId: string): Promise<number> {
    const posts = getLocalItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    let newLikes = 0;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        newLikes = (p.likes_count || 0) + 1;
        return { ...p, likes_count: newLikes };
      }
      return p;
    });
    setLocalItem(STORAGE_KEYS.POSTS, updated);
    return newLikes;
  },

  // --- Fundraisers ---
  async getFundraisers(): Promise<Fundraiser[]> {
    const ngos = await this.getNGOs();
    let fundraisers: Fundraiser[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('fundraisers').select('*');
        if (!error && data && data.length > 0) fundraisers = data as Fundraiser[];
      } catch (e) {
        console.warn('Fundraiser fallback', e);
      }
    }

    if (fundraisers.length === 0) {
      fundraisers = getLocalItem<Fundraiser[]>(STORAGE_KEYS.FUNDRAISERS, INITIAL_FUNDRAISERS);
    }

    return fundraisers.map((f) => ({
      ...f,
      ngo: ngos.find((n) => n.id === f.ngo_id),
    }));
  },

  // --- Donations ---
  async donate(fundraiserId: string, amount: number, donorName: string, donorEmail: string, isAnonymous: boolean = false): Promise<Donation> {
    const receiptId = `TXN-80G-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      fundraiser_id: fundraiserId,
      donor_name: donorName,
      donor_email: donorEmail,
      amount,
      is_anonymous: isAnonymous,
      receipt_id: receiptId,
      created_at: new Date().toISOString(),
    };

    // Update fundraiser raised amount locally
    const fundraisers = getLocalItem<Fundraiser[]>(STORAGE_KEYS.FUNDRAISERS, INITIAL_FUNDRAISERS);
    const updatedFundraisers = fundraisers.map((f) => {
      if (f.id === fundraiserId) {
        return { ...f, raised_amount: (Number(f.raised_amount) || 0) + amount };
      }
      return f;
    });
    setLocalItem(STORAGE_KEYS.FUNDRAISERS, updatedFundraisers);

    // Save donation record
    const donations = getLocalItem<Donation[]>(STORAGE_KEYS.DONATIONS, []);
    setLocalItem(STORAGE_KEYS.DONATIONS, [newDonation, ...donations]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donations').insert([newDonation]);
        await supabase.rpc('increment_fundraiser_raised', { f_id: fundraiserId, added_amount: amount });
      } catch (e) {
        console.warn('Supabase donation record sync error', e);
      }
    }

    return newDonation;
  },

  // --- Volunteer Needs ---
  async getVolunteerNeeds(): Promise<VolunteerNeed[]> {
    const ngos = await this.getNGOs();
    let needs: VolunteerNeed[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('volunteer_needs').select('*');
        if (!error && data && data.length > 0) needs = data as VolunteerNeed[];
      } catch (e) {
        console.warn('Volunteer needs fallback', e);
      }
    }

    if (needs.length === 0) {
      needs = getLocalItem<VolunteerNeed[]>(STORAGE_KEYS.VOLUNTEER_NEEDS, INITIAL_VOLUNTEER_NEEDS);
    }

    return needs.map((v) => ({
      ...v,
      ngo: ngos.find((n) => n.id === v.ngo_id),
    }));
  },

  async applyVolunteer(volunteerNeedId: string, applicantName: string, applicantEmail: string, applicantPhone: string, skills: string): Promise<VolunteerApplication> {
    const newApp: VolunteerApplication = {
      id: `volapp-${Date.now()}`,
      volunteer_need_id: volunteerNeedId,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applicant_phone: applicantPhone,
      skills,
      status: 'approved',
      created_at: new Date().toISOString(),
    };

    // Update slots
    const needs = getLocalItem<VolunteerNeed[]>(STORAGE_KEYS.VOLUNTEER_NEEDS, INITIAL_VOLUNTEER_NEEDS);
    const updatedNeeds = needs.map((n) => {
      if (n.id === volunteerNeedId) {
        const nextFilled = (n.filled_slots || 0) + 1;
        return {
          ...n,
          filled_slots: nextFilled,
          status: (nextFilled >= n.total_slots ? 'filled' : 'open') as 'open' | 'filled',
        };
      }
      return n;
    });
    setLocalItem(STORAGE_KEYS.VOLUNTEER_NEEDS, updatedNeeds);

    const apps = getLocalItem<VolunteerApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    setLocalItem(STORAGE_KEYS.APPLICATIONS, [newApp, ...apps]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('volunteer_applications').insert([newApp]);
      } catch (e) {
        console.warn('Supabase volunteer application sync error', e);
      }
    }

    return newApp;
  },

  async createFundraiser(fundraiser: Omit<Fundraiser, 'id' | 'raised_amount'>): Promise<Fundraiser> {
    const newFund: Fundraiser = {
      ...fundraiser,
      id: `fund-${Date.now()}`,
      raised_amount: 0,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('fundraisers').insert([newFund]).select().single();
        if (!error && data) return data as Fundraiser;
      } catch (e) {
        console.error('Supabase fundraiser insert failed', e);
      }
    }

    const current = getLocalItem<Fundraiser[]>(STORAGE_KEYS.FUNDRAISERS, INITIAL_FUNDRAISERS);
    const updated = [newFund, ...current];
    setLocalItem(STORAGE_KEYS.FUNDRAISERS, updated);
    return newFund;
  },

  async createVolunteerNeed(need: Omit<VolunteerNeed, 'id' | 'filled_slots'>): Promise<VolunteerNeed> {
    const newNeed: VolunteerNeed = {
      ...need,
      id: `vol-${Date.now()}`,
      filled_slots: 0,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('volunteer_needs').insert([newNeed]).select().single();
        if (!error && data) return data as VolunteerNeed;
      } catch (e) {
        console.error('Supabase volunteer_need insert failed', e);
      }
    }

    const current = getLocalItem<VolunteerNeed[]>(STORAGE_KEYS.VOLUNTEER_NEEDS, INITIAL_VOLUNTEER_NEEDS);
    const updated = [newNeed, ...current];
    setLocalItem(STORAGE_KEYS.VOLUNTEER_NEEDS, updated);
    return newNeed;
  },

  async getDonations(): Promise<Donation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Donation[];
      } catch (e) {
        console.warn('Donations fallback', e);
      }
    }
    return getLocalItem<Donation[]>(STORAGE_KEYS.DONATIONS, [
      {
        id: 'don-demo-1',
        fundraiser_id: 'fund-1',
        donor_name: 'Ananya Deshmukh',
        donor_email: 'ananya@gmail.com',
        amount: 2500,
        is_anonymous: false,
        receipt_id: 'TXN-80G-DEMO-9901',
        created_at: '2026-10-01T14:30:00Z',
      },
      {
        id: 'don-demo-2',
        fundraiser_id: 'fund-2',
        donor_name: 'Anonymous Donor',
        donor_email: 'donor@gmail.com',
        amount: 7000,
        is_anonymous: true,
        receipt_id: 'TXN-80G-DEMO-8802',
        created_at: '2026-10-01T16:45:00Z',
      },
    ]);
  },

  async getDonationByReceiptId(receiptId: string): Promise<Donation | undefined> {
    const donations = await this.getDonations();
    return donations.find((d) => d.receipt_id.toLowerCase().trim() === receiptId.toLowerCase().trim());
  },

  async getVolunteerApplications(): Promise<VolunteerApplication[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('volunteer_applications').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as VolunteerApplication[];
      } catch (e) {
        console.warn('Volunteer apps fallback', e);
      }
    }
    return getLocalItem<VolunteerApplication[]>(STORAGE_KEYS.APPLICATIONS, [
      {
        id: 'app-demo-1',
        volunteer_need_id: 'vol-1',
        applicant_name: 'Aditya Verma',
        applicant_email: 'aditya.v@outlook.com',
        applicant_phone: '+91 98201 12345',
        skills: 'Inventory management & food logistics experience',
        status: 'approved',
        created_at: '2026-10-01T12:00:00Z',
      },
      {
        id: 'app-demo-2',
        volunteer_need_id: 'vol-2',
        applicant_name: 'Meera Nambiar',
        applicant_email: 'meera.n@gmail.com',
        applicant_phone: '+91 97402 54321',
        skills: 'Frontend web development (React, JS), English tutor',
        status: 'pending',
        created_at: '2026-10-01T17:10:00Z',
      },
    ]);
  },

  async updateApplicationStatus(appId: string, status: 'approved' | 'pending'): Promise<void> {
    const apps = getLocalItem<VolunteerApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    const updated = apps.map((a) => (a.id === appId ? { ...a, status } : a));
    setLocalItem(STORAGE_KEYS.APPLICATIONS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('volunteer_applications').update({ status }).eq('id', appId);
      } catch (e) {
        console.warn('Supabase app status sync error', e);
      }
    }
  },

  // --- State Metrics & Geographic Ledger ---
  async getStateMetrics(): Promise<StateImpactData[]> {
    const { STATE_METRICS } = await import('./mockData');
    return STATE_METRICS;
  },

  async getStateByName(stateName: string): Promise<StateImpactData | undefined> {
    const metrics = await this.getStateMetrics();
    const cleanQuery = decodeURIComponent(stateName).toLowerCase().replace(/-/g, ' ');
    return metrics.find((s) => s.state.toLowerCase() === cleanQuery || s.state.toLowerCase().includes(cleanQuery));
  },

  async getNGOsByState(stateName: string): Promise<NGO[]> {
    const ngos = await this.getNGOs();
    const clean = decodeURIComponent(stateName).toLowerCase().replace(/-/g, ' ');
    return ngos.filter((n) => (n.state && n.state.toLowerCase().includes(clean)) || n.location.toLowerCase().includes(clean));
  },

  // --- NGO Registration Submissions & Verification Pipeline ---
  async registerNGO(submission: Omit<NGORegistrationSubmission, 'id' | 'submitted_at' | 'status'>): Promise<NGORegistrationSubmission> {
    const newSubmission: NGORegistrationSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      status: 'pending_review',
      submitted_at: new Date().toISOString(),
    };

    const currentSubs = getLocalItem<NGORegistrationSubmission[]>('openseva_ngo_submissions', [
      {
        id: 'sub-vishwakarma',
        organization_name: 'Vishwakarma Services Foundation',
        organization_type: 'Trust',
        email: 'info@vishwakarma-foundation.org',
        mobile: '+91 98220 54321',
        official_address: 'Survey No. 42, Shivajinagar, Pune 411005',
        state: 'Maharashtra',
        district: 'Pune',
        city: 'Pune',
        pin_code: '411005',
        registration_number: 'MAH-PUN-2017-8821',
        registration_date: '2017-08-15',
        renewal_status: 'Active',
        last_renewal_date: '2025-08-15',
        registration_authority: 'Charity Commissioner, Pune',
        pan_number: 'AAATV1234F',
        office_bearers_count: 5,
        office_bearers: [
          { name: 'Dr. Ramesh Vishwakarma', designation: 'President' },
          { name: 'Smt. Sunita Patil', designation: 'Secretary' },
          { name: 'Shri. Anand Deshmukh', designation: 'Treasurer' },
        ],
        causes: ['Education', 'Healthcare', 'Rural Development'],
        status: 'platform_verified',
        submitted_at: '2026-09-01T10:00:00Z',
      }
    ]);

    const updated = [newSubmission, ...currentSubs];
    setLocalItem('openseva_ngo_submissions', updated);
    return newSubmission;
  },

  async getNGOSubmissions(): Promise<NGORegistrationSubmission[]> {
    return getLocalItem<NGORegistrationSubmission[]>('openseva_ngo_submissions', [
      {
        id: 'sub-vishwakarma',
        organization_name: 'Vishwakarma Services Foundation',
        organization_type: 'Trust',
        email: 'info@vishwakarma-foundation.org',
        mobile: '+91 98220 54321',
        official_address: 'Survey No. 42, Shivajinagar, Pune 411005',
        state: 'Maharashtra',
        district: 'Pune',
        city: 'Pune',
        pin_code: '411005',
        registration_number: 'MAH-PUN-2017-8821',
        registration_date: '2017-08-15',
        renewal_status: 'Active',
        last_renewal_date: '2025-08-15',
        registration_authority: 'Charity Commissioner, Pune',
        pan_number: 'AAATV1234F',
        office_bearers_count: 5,
        office_bearers: [
          { name: 'Dr. Ramesh Vishwakarma', designation: 'President' },
          { name: 'Smt. Sunita Patil', designation: 'Secretary' },
          { name: 'Shri. Anand Deshmukh', designation: 'Treasurer' },
        ],
        causes: ['Education', 'Healthcare', 'Rural Development'],
        status: 'platform_verified',
        submitted_at: '2026-09-01T10:00:00Z',
      }
    ]);
  },

  async updateNGOSubmissionStatus(id: string, status: NGORegistrationSubmission['status']): Promise<void> {
    const subs = await this.getNGOSubmissions();
    const updated = subs.map((s) => (s.id === id ? { ...s, status } : s));
    setLocalItem('openseva_ngo_submissions', updated);
  },

  // --- Auth Session Simulation ---
  getCurrentUser(): User | null {
    return getLocalItem<User | null>('openseva_auth_user', {
      id: 'usr-demo-1',
      name: 'Aditya Verma',
      email: 'aditya@tektonix.internal',
      phone: '+91 98200 11223',
      role: 'user',
      city: 'Pune',
      state: 'Maharashtra',
    });
  },

  setCurrentUser(user: User | null): void {
    setLocalItem('openseva_auth_user', user);
  },

  async loginUser(email: string, _pass: string): Promise<{ user: User }> {
    const role = email.toLowerCase().includes('ngo') ? 'ngo' : email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      phone: '+91 98765 43210',
      role,
      city: 'Pune',
      state: 'Maharashtra',
    };
    this.setCurrentUser(user);
    return { user };
  },

  async registerUser(name: string, email: string, phone: string, _pass: string, role: 'user' | 'ngo' = 'user', city: string = 'Pune', state: string = 'Maharashtra'): Promise<{ user: User }> {
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      phone,
      role,
      city,
      state,
      created_at: new Date().toISOString(),
    };
    this.setCurrentUser(user);
    return { user };
  },
};

