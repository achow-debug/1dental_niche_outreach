import type { SupabaseClient } from '@supabase/supabase-js'

const AVATAR_BUCKET = 'avatars'
const SIGNED_URL_TTL = 3600

/** Path inside the `avatars` bucket, e.g. `{userId}/avatar.jpg` */
export function avatarObjectPath(userId: string, extension: string) {
  const ext = extension.replace(/^\./, '').toLowerCase()
  return `${userId}/avatar.${ext}`
}

export function extensionFromMime(mime: string): string | null {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  return null
}

export async function getAvatarSignedUrl(
  supabase: SupabaseClient,
  pathInBucket: string | null | undefined
): Promise<string | null> {
  if (!pathInBucket?.trim()) return null
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(pathInBucket, SIGNED_URL_TTL)
  if (error || !data?.signedUrl) return null
  return data.signedUrl
}

export { AVATAR_BUCKET, SIGNED_URL_TTL }
