import { NuxtFireInstance } from '@nuxtjs/firebase'

let $fire: NuxtFireInstance

function initializeFirebase (firebaseInstance: NuxtFireInstance) {
  $fire = firebaseInstance
}

export { initializeFirebase, $fire }
