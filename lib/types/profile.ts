export type ProfileRole = 'user' | 'client' | 'staff' | 'admin'

export type ProfileStatus = 'active' | 'suspended' | 'banned' | 'pending_review'

export type Profile = {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: ProfileRole
  status: ProfileStatus
  moderation_note: string | null
  created_at: string
  updated_at: string
}
