import { Middleware } from '@nuxt/types'
import { userStore, menuStore } from '@/store'

const authMiddleware: Middleware = async ({ route, redirect }) => {
  if (route.path !== '/auth/signIn' && !userStore.authUser?.uid) {
    return redirect('/auth/signIn')
  }

  await menuStore.defineMenus(userStore.authUser.uid!)
}

export default authMiddleware
