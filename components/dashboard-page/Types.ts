
export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  profileImageUrl: string | null;
  role: string;
  userId: string;
  subscription: string | null;
  created_at: Date;
  updated_at: Date;
  projectRoomsUser: ProjectRoomUser[];
}

export interface ProjectRoom {
  id: string;
  title: string;
  description: string;
  url: string;
  inviteUrl: string | null;
  visitor: number;
  createdAt: Date;
  updatedAt: Date;
  users: ProjectRoomUser[];
  analyses: Analysis[]; // Note: Analysis interface is not provided in the original schema
  tasks: Task[];
  feedbacks: Feedback[];
}

export interface ProjectRoomUser {
  id: string;
  user: User;
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  projectRoom: ProjectRoom;
  projectRoomId: string;
  role: string;
  assignedTasks: Task[];
  createdTasks: Task[];
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date | null;
  status: string;
  priority: string;
  assignee: ProjectRoomUser;
  assigneeId: string;
  assignor: ProjectRoomUser;
  assignorId: string;
  projectRoom: ProjectRoom;
  projectRoomId: string;
}

export interface Feedback {
    id: string
    message: string
    rating: number
    createdAt: string | Date;
    name: string
    upvotes: number
    downvotes: number
}


export interface Analysis {
  id: string
  title: string
  description: string
  overallRating: number
  createdBy: string
  createdAt: string
  updatedAt: string
  ratingDistribution: {
      fiveStarCount: number
      fiveStarPercentage: number
      fourStarCount: number
      fourStarPercentage: number
      threeStarCount: number
      threeStarPercentage: number
      twoStarCount: number
      twoStarPercentage: number
      oneStarCount: number
      oneStarPercentage: number
  }
  sentimentBreakdown: {
      positiveCount: number
      positivePercentage: number
      neutralCount: number
      neutralPercentage: number
      negativeCount: number
      negativePercentage: number
  }
  topIssues: Array<{
      issue: string
      frequency: number
      averageRating: number
  }>
  ratingTrends: Array<{
      date: string
      averageRating: number
  }>
  keywordAnalyses: Array<{
      keyword: string
      frequency: number
      sentiment: string
      associatedRatings: number[]
  }>
}