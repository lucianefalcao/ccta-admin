import User from './User'

export default interface Center {
  uid?: String,
  about?: String,
  location?: String,
  user?: User,
  lastModified?: number
}
