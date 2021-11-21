<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <event-publish
      v-else
      :page-title="'Editar Evento'"
      :event="event"
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
export default class Edit extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false
  fetchingData: Boolean = true

  event: Event = {
    uid: undefined,
    title: undefined,
    date: undefined,
    lastModified: undefined,
    user: undefined,
    description: undefined
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveEvent (event: Event): Promise<void> {
    try {
      await eventsStore.update(event)
      this.$router.push('/events')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar o evento. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.event = await eventsStore.getEventByUid(this.$route.params.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
