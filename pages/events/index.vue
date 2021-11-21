<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card class="pa-5">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="publishEvent">
          <v-icon left>
            {{ icons.mdiPlus }}
          </v-icon>
          Publicar Evento
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="editais"
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
                small
                depressed
                outlined
                color="secondary"
                :loading="downloadingDocument && item.uid === uid"
                @click="download(item)"
              >
                Donwload
              </v-btn>

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
import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { eventsStore } from '@/store'
import Edital from '@/models/domain/Edital'

@Component
export default class Index extends Vue {
  icons = {
    mdiDelete,
    mdiPencil,
    mdiPlus
  }

  headers = [
    {
      text: 'Título',
      align: 'start',
      value: 'title'
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

  fetchingData: Boolean = false
  isDeleting: Boolean = false
  downloadingDocument: Boolean = false
  snackbar: Boolean = false
  editais: Edital[] = []
  message: String = 'Nenhuma notícia cadastrada'
  uid: String = ''
  errorMessage: String = ''

  publishEvent (): void {
    this.$router.push('/editais/publish')
  }

  editar (uid: String): void {
    this.$router.push(`/editais/edit/${uid}`)
  }

  async deleteEvent (item: Edital): Promise<void> {
    try {
      this.uid = item.uid!
      this.isDeleting = true
      this.editais = await editaisStore.delete(item)
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao deletar o edital.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.isDeleting = false
    }
  }

  async mounted (): Promise<void> {
    try {
      this.fetchingData = true
      this.editais = await editaisStore.getAll()
    } catch (error) {
      this.message = 'Ocorreu um erro ao buscar os editais. Por favor, tente novamento mais tarde.'
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
