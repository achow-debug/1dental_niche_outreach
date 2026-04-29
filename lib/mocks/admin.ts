export type AdminNavItem = {
  href: string
  label: string
}

export type TreatmentTypeRow = {
  id: string
  name: string
  category: string
  durationMinutes: number
  price: number
  status: 'active' | 'archived'
  updatedAt: string
}

export type ClientRow = {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'suspended'
  role: 'user' | 'client' | 'admin'
  totalBookings: number
  lastBooking: string
  engagementScore: number
}

export type BookingRow = {
  id: string
  clientName: string
  treatmentType: string
  date: string
  time: string
  price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'no_show'
}

export type ServiceCategory = {
  id: string
  name: string
  description: string
  isActive: boolean
}

export type ServiceTemplate = {
  id: string
  title: string
  category: string
  basePrice: number
  subscription: 'none' | 'monthly' | 'quarterly'
  defaultDurationMinutes: number
  isActive: boolean
}

export type ActiveService = {
  id: string
  templateTitle: string
  clinician: string
  startsAt: string
  endsAt: string
  priceOverride: number | null
  status: 'scheduled' | 'cancelled' | 'completed'
}

export type NotificationItem = {
  id: string
  title: string
  body: string
  severity: 'info' | 'warning' | 'critical'
  read: boolean
  href: string
  createdAt: string
}

export type RecentActivityItem = {
  id: string
  actorType: 'user' | 'admin'
  actorName: string
  action: string
  target: string
  createdAt: string
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin/treatment-types', label: 'Services' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/bookings', label: 'Bookings' },
]

export const OVERVIEW_QUICK_ACTIONS = [
  { href: '/admin/treatment-types', label: 'New treatment type' },
  { href: '/admin/clients', label: 'Add client' },
  { href: '/admin/bookings', label: 'Create booking' },
  { href: '/admin/bookings?view=today', label: "Open today's bookings" },
]

export const TREATMENT_TYPES: TreatmentTypeRow[] = [
  {
    id: 'tt-001',
    name: 'New patient exam',
    category: 'General dentistry',
    durationMinutes: 45,
    price: 120,
    status: 'active',
    updatedAt: '2026-04-24',
  },
  {
    id: 'tt-002',
    name: 'Hygiene maintenance',
    category: 'Preventive care',
    durationMinutes: 30,
    price: 85,
    status: 'active',
    updatedAt: '2026-04-22',
  },
  {
    id: 'tt-003',
    name: 'Teeth whitening',
    category: 'Cosmetic',
    durationMinutes: 60,
    price: 240,
    status: 'active',
    updatedAt: '2026-04-21',
  },
  {
    id: 'tt-004',
    name: 'Emergency review',
    category: 'Urgent care',
    durationMinutes: 25,
    price: 95,
    status: 'archived',
    updatedAt: '2026-04-18',
  },
]

export const CLIENTS: ClientRow[] = [
  {
    id: 'cl-001',
    name: 'Ariana Moore',
    email: 'ariana@example.com',
    phone: '+44 7700 000111',
    status: 'active',
    role: 'client',
    totalBookings: 8,
    lastBooking: '2026-04-21',
    engagementScore: 82,
  },
  {
    id: 'cl-002',
    name: 'Noah Williams',
    email: 'noah@example.com',
    phone: '+44 7700 000222',
    status: 'active',
    role: 'user',
    totalBookings: 3,
    lastBooking: '2026-04-20',
    engagementScore: 64,
  },
  {
    id: 'cl-003',
    name: 'Harper Patel',
    email: 'harper@example.com',
    phone: '+44 7700 000333',
    status: 'suspended',
    role: 'client',
    totalBookings: 11,
    lastBooking: '2026-04-16',
    engagementScore: 43,
  },
]

export const BOOKINGS: BookingRow[] = [
  {
    id: 'bk-001',
    clientName: 'Ariana Moore',
    treatmentType: 'Hygiene maintenance',
    date: '2026-04-26',
    time: '09:30',
    price: 85,
    status: 'confirmed',
  },
  {
    id: 'bk-002',
    clientName: 'Noah Williams',
    treatmentType: 'New patient exam',
    date: '2026-04-26',
    time: '10:30',
    price: 120,
    status: 'pending',
  },
  {
    id: 'bk-003',
    clientName: 'Harper Patel',
    treatmentType: 'Emergency review',
    date: '2026-04-25',
    time: '14:00',
    price: 95,
    status: 'cancelled',
  },
  {
    id: 'bk-004',
    clientName: 'Ariana Moore',
    treatmentType: 'Teeth whitening',
    date: '2026-04-27',
    time: '12:15',
    price: 240,
    status: 'no_show',
  },
]

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Teeth cleaning', description: 'Hygiene and preventive cleaning visits', isActive: true },
  { id: 'cat-2', name: 'Regular checkup', description: 'Routine exams and oral health checks', isActive: true },
  { id: 'cat-3', name: 'Cosmetic', description: 'Whitening and aesthetic services', isActive: true },
]

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'st-1',
    title: 'Invisalign consultation',
    category: 'Cosmetic',
    basePrice: 149,
    subscription: 'none',
    defaultDurationMinutes: 40,
    isActive: true,
  },
  {
    id: 'st-2',
    title: 'Check-up',
    category: 'Regular checkup',
    basePrice: 95,
    subscription: 'quarterly',
    defaultDurationMinutes: 30,
    isActive: true,
  },
  {
    id: 'st-3',
    title: 'Scaling and polish',
    category: 'Teeth cleaning',
    basePrice: 85,
    subscription: 'monthly',
    defaultDurationMinutes: 35,
    isActive: true,
  },
]

export const ACTIVE_SERVICES: ActiveService[] = [
  {
    id: 'srv-1',
    templateTitle: 'Check-up',
    clinician: 'Dr. Lin',
    startsAt: '2026-04-26T09:00',
    endsAt: '2026-04-26T09:30',
    priceOverride: null,
    status: 'scheduled',
  },
  {
    id: 'srv-2',
    templateTitle: 'Invisalign consultation',
    clinician: 'Dr. Ahmed',
    startsAt: '2026-04-26T10:00',
    endsAt: '2026-04-26T10:40',
    priceOverride: 129,
    status: 'scheduled',
  },
]

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf-001',
    title: 'New booking request',
    body: 'Noah Williams requested New patient exam for 10:30.',
    severity: 'info',
    read: false,
    href: '/admin/bookings',
    createdAt: '2m ago',
  },
  {
    id: 'ntf-002',
    title: 'Capacity warning',
    body: 'Hygiene maintenance is at 90% capacity this week.',
    severity: 'warning',
    read: false,
    href: '/admin/bookings',
    createdAt: '12m ago',
  },
  {
    id: 'ntf-003',
    title: 'Session cancellation',
    body: 'Emergency review at 14:00 was cancelled.',
    severity: 'critical',
    read: true,
    href: '/admin/bookings',
    createdAt: '45m ago',
  },
]

export const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'act-001',
    actorType: 'user',
    actorName: 'Noah Williams',
    action: 'Requested new patient exam booking',
    target: 'Booking bk-002',
    createdAt: '2m ago',
  },
  {
    id: 'act-002',
    actorType: 'admin',
    actorName: 'Admin team',
    action: 'Confirmed hygiene maintenance booking',
    target: 'Booking bk-001',
    createdAt: '11m ago',
  },
  {
    id: 'act-003',
    actorType: 'admin',
    actorName: 'Dr. Ahmed',
    action: 'Updated treatment template pricing',
    target: 'Invisalign consultation',
    createdAt: '27m ago',
  },
  {
    id: 'act-004',
    actorType: 'user',
    actorName: 'Ariana Moore',
    action: 'Viewed upcoming appointment details',
    target: 'Booking bk-004',
    createdAt: '39m ago',
  },
]
