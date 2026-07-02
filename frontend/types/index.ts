export interface Student {
  id: string
  name: string
  avatar: string
  college: string
  degree: string
  year: number
  city: string
  skills: string[]
  interests: string[]
  lookingFor: string[]
  bio: string
  wins: number
  projects: number
  badges: Badge[]
  lat: number
  lng: number
  github?: string
  linkedin?: string
  portfolio?: string
  currentOpportunity?: string
  availability?: string
}

export interface Badge {
  label: string
  color: "green" | "yellow" | "pink" | "blue"
}

export type OpportunityType =
  | "Hackathon"
  | "Scholarship"
  | "Competition"
  | "Fellowship"
  | "Internship"
  | "Research"

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced"

export interface Opportunity {
  id: string
  title: string
  organizer: string
  type: OpportunityType
  difficulty: DifficultyLevel
  deadline: string
  prize: string
  teamSize: string
  tags: string[]
  description: string
  eligibility: string[]
  location: string
  isRemote: boolean
  isBookmarked?: boolean
  applicants: number
  image?: string
  lat?: number
  lng?: number
}

export interface Team {
  id: string
  name: string
  opportunity: string
  opportunityId: string
  leader: string
  leaderAvatar: string
  members: TeamMember[]
  rolesNeeded: string[]
  description: string
  skills: string[]
  college: string
  city: string
  createdAt: string
  isOpen: boolean
}

export interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
}

export interface Showcase {
  id: string
  title: string
  team: string
  members: ShowcaseMember[]
  competition: string
  rank: string
  year: number
  description: string
  techStack: string[]
  tags: string[]
  github?: string
  demo?: string
  ppt?: string
  image: string
  views: number
  likes: number
  college: string
}

export interface ShowcaseMember {
  name: string
  avatar: string
  role: string
}

export interface Mentor {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  expertise: string[]
  bio: string
  sessions: number
  rating: number
  college: string
  wins: string[]
  available: boolean
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  college: string
  year: string
  text: string
  competition: string
  outcome: string
  badge: string
}

export interface Stat {
  label: string
  value: string
  suffix?: string
  description: string
  icon: string
}

export interface FAQItem {
  question: string
  answer: string
}
