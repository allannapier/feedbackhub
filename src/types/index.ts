// User types
export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  plan: 'free' | 'starter' | 'pro' | 'scale'
  createdAt: Date
  updatedAt: Date
}

// Form types
export interface Form {
  id: string
  userId: string
  title: string
  question: string
  type: 'rating' | 'text' | 'nps' | 'yesno' | 'multiple'
  settings: FormSettings
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FormSettings {
  maxRating?: number
  color?: string
  logo?: string
  thankYouMessage?: string
  redirectUrl?: string
  allowComments?: boolean
  requireEmail?: boolean
  multipleChoiceOptions?: string[]
}

// Response types
export interface Response {
  id: string
  formId: string
  rating?: number
  text?: string
  answer?: string
  respondentEmail?: string
  respondentName?: string
  shared: boolean
  sharedAt?: Date
  shareData?: ShareData
  createdAt: Date
}

export interface ShareData {
  twitter?: boolean
  linkedin?: boolean
  facebook?: boolean
  instagram?: boolean
}