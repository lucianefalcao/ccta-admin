<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <v-btn color="primary" @click="updateCenterInfo">
          <v-icon left>
            {{ icons.mdiPlus }}
          </v-icon>
          {{ centerInfoButtonText }}
        </v-btn>
        <v-spacer />
        <v-btn color="primary">
          <v-icon left>
            {{ icons.mdiPlus }}
          </v-icon>
          Cadastrar curso
        </v-btn>
      </v-card-actions>

      <v-card-title>Sobre</v-card-title>
      <v-card-text>
        {{ center.about }}
      </v-card-text>

      <v-card-title>Localização</v-card-title>
      <v-card-text>
        {{ center.location }}
      </v-card-text>

      <v-card-title>Cursos</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="courses"
          :items-per-page="10"
          :no-data-text="message"
          :footer-props="{
            itemsPerPageAllText: 'Todas',
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20, -1]
          }"
        >
          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                icon
                color="secondary"
                @click="editar(item.uid)"
              >
                <v-icon>
                  {{ icons.mdiPencil }}
                </v-icon>
              </v-btn>
              <v-btn
                icon
                class="text-right"
                color="red"
                :loading="isDeleting && item.uid === uid"
                @click="deleteEvent(item)"
              >
                <v-icon>
                  {{ icons.mdiDelete }}
                </v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { mdiPlus, mdiDelete, mdiPencil } from '@mdi/js'
import { centerStore, courseStore } from '@/store'
import Center from '~/models/domain/Center'
import Course from '~/models/domain/Course'

@Component
export default class Index extends Vue {
  icons = {
    mdiPlus,
    mdiDelete,
    mdiPencil
  }

  headers = [
    {
      text: 'Título',
      align: 'start',
      value: 'title'
    },
    {
      text: 'Tipo',
      value: 'type'
    },
    {
      text: 'Opções',
      value: 'actions',
      align: 'center',
      class: 'v-data-table-header',
      sortable: false,
      width: '220px'
    }
  ]

  courses: Course[] = []
  center: Center = {
    uid: undefined,
    about: '',
    location: ''
  }

  message: String = 'Nenhum curso cadastrado'

  fetchingData: Boolean = false
  isDeleting: Boolean = false

  get existeInfoCentro (): Boolean {
    return this.center.uid !== undefined
  }

  get centerInfoButtonText (): String {
    return this.existeInfoCentro ? 'Editar informações do centro' : 'Cadastrar informações do centro'
  }

  updateCenterInfo (): void {
    if (this.existeInfoCentro) {
      this.$router.push(`/info-centro/edit/${this.center.uid}`)
    } else {
      this.$router.push('/info-centro/publish')
    }
  }

  async mounted (): Promise<void> {
    try {
      this.fetchingData = true
      this.center = await centerStore.getCenterInfo()
      this.courses = await courseStore.getAll()
    } catch (error) {
      this.message = 'Ocorreu um erro ao buscar os eventos. Por favor, tente novamento mais tarde.'
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
