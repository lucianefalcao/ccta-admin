import User from './User'

export default interface Event {
  uid?: String,
  title?: String,
  description?: String,
  date?: number,
  lastModified?: number,
  user?: User,
}
