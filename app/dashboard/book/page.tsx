import { createClient } from '@/lib/supabase/server'
import { loadDashboardBookCatalogServer } from '@/lib/dashboard/load-dashboard-book-catalog-server'
import { BookTreatmentPickerClient } from '@/app/dashboard/book/book-treatment-picker-client'

export default async function DashboardBookPage() {
  const supabase = await createClient()
  const catalog = await loadDashboardBookCatalogServer(supabase)
  return <BookTreatmentPickerClient initialCatalog={catalog} />
}
