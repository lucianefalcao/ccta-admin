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
        <v-row>
          <v-col>
            <h2 class="pr-2">
              {{ course.name }}
            </h2>
            {{ course.type }} • {{ course.subType }} <span class="body-2"> ({{ turnos[course.turno] }} • {{ course.nrPeriods }} períodos) </span>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="mb-2">
        Criado por {{ course.user.name }} • última atualização {{ lastModified }}
      </v-card-text>

      <v-card-title>
        Descrição
      </v-card-title>

      <v-card-text class="black--text">
        {{ course.description }}
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
import { courseStore } from '@/store'
import Course from '~/models/domain/Course'
import BackButton from '@/components/BackButton.vue'
import Snackbar from '@/components/Snackbar.vue'

@Component({
  components: {
    BackButton,
    Snackbar
  }
})
export default class CourseUid extends Vue {
  course: Course = {
    name: undefined,
    type: undefined,
    subType: undefined,
    nrPeriods: 0,
    turno: 'M',
    description: undefined,
    user: undefined
  }

  turnos = {
    M: 'Manhã',
    T: 'Tarde',
    I: 'Integral',
    N: 'Noite'
  }

  errorMessage: String = ''
  fetchingData: Boolean = true
  isPublished: Boolean = false
  snackbar: Boolean = false

  get lastModified (): String {
    return new Date(this.course.lastModified as number).toLocaleDateString('pt-BR')
  }

  editar (): void {
    this.$router.push('/info-centro/courses/edit/' + this.course.uid)
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async publish (): Promise<void> {
    try {
      this.course = await courseStore.update(this.course)
      this.isPublished = true
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.course = await courseStore.getCourseByUid(this.$route.params.uid)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
