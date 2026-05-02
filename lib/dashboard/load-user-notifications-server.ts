import { createClient } from '@/lib/supabase/server'
import { USER_NOTIFICATIONS } from '@/lib/dashboard/user-notifications'
import { mapUserNotificationRows, type UserNotificationRow } from '@/lib/dashboard/map-user-notifications'
import type { NotificationItem } from '@/lib/mocks/admin'

export async function loadDashboardNotifications(): Promise<NotificationItem[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return USER_NOTIFICATIONS
  }

  const { data, error } = await supabase
    .from('user_notifications')
    .select('id, title, body, severity, read_at, href, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(40)

  if (error) {
    const msg = error.message?.toLowerCase() ?? ''
    if (msg.includes('user_notifications') || msg.includes('does not exist') || error.code === '42P01') {
      return USER_NOTIFICATIONS
    }
    return []
  }

  return mapUserNotificationRows(data as UserNotificationRow[])
}
