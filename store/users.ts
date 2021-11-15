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

  isAuthenticated: Boolean = false

  @Mutation
  setAuthUser (user: User): void {
    console.log(this)
    this.authUser.uid = user.uid
    this.authUser.email = user.email
    this.authUser.name = user.name

    this.isAuthenticated = true
  }

  @Action({ rawError: true })
  async signIn ({ email, password }: { email: String, password: String }): Promise<void> {
    await $fire.auth.signInWithEmailAndPassword(email, password)
  }

  @Action({ rawError: true })
  async getUserByUid (uid: String): Promise<User> {
    const user = await $fire.firestore.collection('users').doc(uid).get()
    return { uid: user.id, email: user.data().email, name: user.data().name }
  }

  @Action({ commit: 'setAuthUser', rawError: true })
  async onAuthStateChanged ({ authUser }: { authUser: any }): Promise<User> {
    const user = await this.store.$fire.firestore.collection('users').doc(authUser.uid).get('name')
    return { uid: authUser.uid, email: user.data().email, name: user.data().name }
  }
}
