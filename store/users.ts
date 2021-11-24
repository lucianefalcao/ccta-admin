import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import User from '@/models/domain/User'
import { $fire } from '~/utils/firebase-accessor'

@Module({ name: 'users', stateFactory: true, namespaced: true })
export default class UsersModule extends VuexModule {
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
  async update ({ name, email, password }: {name: String, email: String, password: String}): Promise<void> {
    const user = this.store.$fire.auth.currentUser

    await user.updateEmail(email)
    await user.updatePassword(password)

    const userRef = await this.store.$fire.firestore.collection('users').doc(user.uid)
    await userRef.update({ name, email })
  }

  @Action({ rawError: true })
  async onAuthStateChanged ({ authUser }: { authUser: any }): Promise<void> {
    if (authUser) {
      const user = await this.store.$fire.firestore.collection('users').doc(authUser.uid).get()
      this.context.commit('setAuthUser', { uid: authUser.uid, email: user.data().email, name: user.data().name })
    } else {
      this.context.commit('setAuthUser', null)
    }
  }
}
