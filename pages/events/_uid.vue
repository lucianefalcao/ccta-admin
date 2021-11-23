<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-actions class="mb-10">
        <back-button />
        <v-spacer />
        <v-btn
          depressed
          color="secondary"
          @click="editar"
        >
          Editar
        </v-btn>
      </v-card-actions>

      <v-card-title style="word-break: break-word;">
        <h2 class="pr-2">
          {{ event.title }}
        </h2>
      </v-card-title>

      <v-card-text class="mb-2">
        Criado por {{ event.user.name }} • última atualização {{ lastModified }}
      </v-card-text>

      <v-card-title>
        Data: {{ eventDate }}
      </v-card-title>

      <v-card-title>
        Descrição
      </v-card-title>

      <v-card-text class="black--text">
        {{ event.description }}
      </v-card-text>
    </v-card>

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
import Event from '~/models/domain/Event'
import BackButton from '@/components/BackButton.vue'
import Snackbar from '@/components/Snackbar.vue'

@Component({
  components: {
    BackButton,
    Snackbar
  }
})
export default class CourseUid extends Vue {
  event: Event = {
    uid: undefined,
    title: undefined,
    date: undefined,
    lastModified: undefined,
    user: undefined,
    description: undefined
  }

  errorMessage: String = ''
  fetchingData: Boolean = true
  snackbar: Boolean = false

  get lastModified (): String {
    return new Date(this.event.lastModified as number).toLocaleDateString('pt-BR')
  }

  get eventDate (): String {
    const date = new Date(this.event.date as number)
    const time = date.toLocaleTimeString(['pt-BR'], { hour: '2-digit', minute: '2-digit' })

    return date.toLocaleDateString('pt-BR') + ' às ' + time
  }

  editar (): void {
    this.$router.push('/events/edit/' + this.event.uid)
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async beforeCreate (): Promise<void> {
    try {
      this.event = await eventsStore.getEventByUid(this.$route.params.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
