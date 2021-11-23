import User from './User'

export default interface Course {
  uid?: String,
  name?: String,
  type?: String,
  subType?: String,
  nrPeriods?: Number,
  lastModified?: number,
  user?: User,
  turno?: String,
  description?: String
}
