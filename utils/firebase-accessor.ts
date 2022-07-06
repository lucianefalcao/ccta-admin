import { NuxtFireInstance } from '@nuxtjs/firebase'

let $fire: NuxtFireInstance

function initializeFirebase (firebaseInstance: NuxtFireInstance): void {
  $fire = firebaseInstance
}

export { initializeFirebase, $fire }
