import { Middleware } from '@nuxt/types'
import { userStore, menuStore } from '@/store'

const authMiddleware: Middleware = async ({ route, redirect }) => {
  if (!route.path.includes('/auth') && !userStore.authUser?.uid) {
    return redirect('/auth/signIn')
  }

  if (userStore.authUser?.uid) {
    await menuStore.defineMenus(userStore.authUser.uid!)
  }
}

export default authMiddleware
