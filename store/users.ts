import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import User from '@/models/domain/User'
import { $fire } from '~/utils/firebase-accessor'

@Module({ name: 'users', stateFactory: true, namespaced: true })
export default class Users extends VuexModule {
  authUser: User = {
    uid: undefined,
    email: undefined,
    name: undefined
  }

  @Mutation
  setAuthUser (user: User): void {
    this.authUser = user
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

  @Action({ rawError: true })
  async onAuthStateChanged ({ authUser }: { authUser: any }): Promise<void> {
    if (authUser) {
      const user = await this.store.$fire.firestore.collection('users').doc(authUser.uid).get('name')
      this.context.commit('setAuthUser', { uid: authUser.uid, email: user.data().email, name: user.data().name })
    } else {
      this.context.commit('setAuthUser', null)
    }
  }
}
