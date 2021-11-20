import User from './User'

export default interface News {
  uid?: String,
  title?: String,
  newsText?: String,
  state?: String,
  dateCreated?: number,
  datePublished?: number,
  user?: User
}
