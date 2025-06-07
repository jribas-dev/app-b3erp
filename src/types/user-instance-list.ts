export interface UserInstanceList {
  id: number
  userId: string
  dbId: string
  roleback: string
  rolefront: string
  isActive: boolean
  instanceName: string
  instanceDbName: string
  instanceDbHost: string
}

export interface UserInstanceListResponse {
  success: boolean
  data?: UserInstanceList[]
  error?: string
}
