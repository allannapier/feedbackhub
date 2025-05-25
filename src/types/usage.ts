export interface UsageRecord {
  id: string
  userId: string
  month: string
  feedbackRequests: number
  socialShares: number
  createdAt: Date
  updatedAt: Date
}

export interface UsageLimits {
  feedbackRequests: number // -1 for unlimited
  socialShares: number // -1 for unlimited
  platforms: string[]
}

export interface UserUsage {
  currentMonth: UsageRecord | null
  limits: UsageLimits
  canCreateFeedbackRequest: boolean
  canShareSocial: boolean
  remainingFeedbackRequests: number
  remainingSocialShares: number
}
