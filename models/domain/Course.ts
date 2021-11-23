import User from './User'

export default interface Course {
  uid?: String,
  name?: String,
  type?: String,
  subType?: String,
  nrPeriods?: number,
  lastModified?: number,
  user?: User,
  turno?: String,
  description?: String
}
