import User from './User'

export default interface News {
  uid?: String,
  title?: String,
  documentPath?: String,
  lastModified?: number,
  user?: User,
}
