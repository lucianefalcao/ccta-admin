import User from './User'

export default interface Permission {
  uid?: String,
  code?: String,
  user?: User,
}
