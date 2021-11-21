import User from './User'

export default interface Center {
  uid?: String,
  about?: String,
  localization?: String,
  user?: User,
  lastModified?: number
}
