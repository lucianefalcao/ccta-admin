import { Plugin } from '@nuxt/types'
import { initializeFirebase } from '~/utils/firebase-accessor'

const accessor: Plugin = ({ $fire }) => {
  initializeFirebase($fire)
}

export default accessor
