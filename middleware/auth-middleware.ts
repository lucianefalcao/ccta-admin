import { Middleware } from '@nuxt/types'
import { userStore } from '@/store'

const authMiddleware: Middleware = ({ route, redirect }) => {
  if (route.path !== '/' && !userStore.authUser?.uid) {
    return redirect('/')
  }
}

export default authMiddleware
