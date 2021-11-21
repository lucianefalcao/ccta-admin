import User from './User'

export default interface Course {
  uid?: String,
  name?: String,
  type?: String,
  nrPeriods?: Number,
  lastModified?: number,
  user: User,
  turno?: String,
  description?: String
}
