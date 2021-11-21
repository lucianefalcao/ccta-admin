<template>
  <v-col align-self="start">
    <event-publish
      :page-title="'Publicar Evento'"
      @saveEvent="saveEvent"
    />

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { eventsStore } from '@/store'
import EventPublish from '@/components/EventPublish.vue'
import Snackbar from '@/components/Snackbar.vue'
import Event from '@/models/domain/Event'

@Component({
  components: {
    EventPublish,
    Snackbar
  }
})
export default class Publish extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveEvent (event: Event): Promise<void> {
    try {
      await eventsStore.save(event)
      this.$router.push('/events')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar o evento. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
