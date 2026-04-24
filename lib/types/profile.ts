export type ProfileRole = 'user' | 'client' | 'staff' | 'admin'

export type ProfileStatus = 'active' | 'suspended' | 'banned' | 'pending_review'

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone_prefix: string | null
  phone_number: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  county: string | null
  post_code: string | null
  country: string | null
  full_name: string
  avatar_url: string | null
  role: ProfileRole
  status: ProfileStatus
  moderation_note: string | null
  created_at: string
  updated_at: string
}
