import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

interface User {
  uid?: String,
  email?: String,
  name?: String
}

@Module({ name: 'users', stateFactory: true, namespaced: true })
export default class Users extends VuexModule {
  authUser: User = {
    uid: undefined,
    email: undefined,
    name: undefined
  }

  @Mutation
  setAuthUser ({ uid, email, name }: { uid: String, email: String, name: String}) {
    this.authUser.uid = uid
    this.authUser.email = email
    this.authUser.name = name
  }
}
