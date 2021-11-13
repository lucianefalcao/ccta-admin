import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $fire } from '~/utils/firebase-accessor'

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
  setAuthUser ({ uid, email, name }: { uid: String, email: String, name: String}): void {
    this.authUser.uid = uid
    this.authUser.email = email
    this.authUser.name = name
  }

  @Action
  async signIn ({ email, password }: { email: String, password: String }): Promise<void> {
    const authUser = await $fire.auth.signInWithEmailAndPassword(email, password)
    const user = await $fire.firestore.collection('users').doc(authUser.user.uid).get()
    this.context.commit('setAuthUser', { uid: user.id, email: user.data().email, name: user.data().name })
  }
}
