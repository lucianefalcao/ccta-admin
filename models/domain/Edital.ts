import User from './User'

export default interface Edital {
  uid?: String,
  title?: String,
  documentPath?: String,
  lastModified?: number,
  user?: User,
}
