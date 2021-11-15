import { Middleware } from '@nuxt/types'
import { userStore } from '@/store'

const authMiddleware: Middleware = ({ redirect }) => {
  if (!userStore.isAuthenticated) {
    return redirect('/')
  }
}

export default authMiddleware
