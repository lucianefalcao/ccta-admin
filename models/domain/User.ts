import Permission from './Permission'

export default interface User {
  uid?: String,
  email?: String,
  name?: String,
  permissions: Permission[]
}
