import User from './User'

export default interface News {
  uid?: String,
  title?: String,
  newsText?: String,
  state?: String,
  lastModified?: number,
  user?: User,
  coverPath?: String
}
