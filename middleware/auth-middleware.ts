import { Middleware } from '@nuxt/types'
import { userStore } from '@/store'

const authMiddleware: Middleware = ({ route, redirect }) => {
  if (route.path !== '/auth/signIn' && !userStore.authUser?.uid) {
    return redirect('/auth/signIn')
  }
}

export default authMiddleware
