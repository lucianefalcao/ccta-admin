<template>
  <v-card class="pa-5">
    <v-card-actions>
      <back-button />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ pageTitle }}</h3>
    </v-card-title>
    <v-card-text>
      <upload-file-button
        :file-name="documentName"
        :default-title="'Documento'"
        :accept-types="'application/pdf'"
        @file="getDocument"
      />

      <v-text-field
        v-model="title"
        label="Título"
        :rules="[rules.title.required]"
        maxlength="120"
        counter
        required
        outlined
        class="mb-5"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        depressed
        :disabled="!canSave"
        color="primary"
        @click="publish"
      >
        Publicar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import BackButton from '@/components/BackButton.vue'
import UploadFileButton from '~/components/UploadFileButton.vue'
import { editaisStore, userStore } from '@/store'
import Edital from '@/models/domain/Edital'

@Component({
  components: {
    BackButton,
    UploadFileButton
  }
})
export default class EditalPublish extends Vue {
  @Prop({ type: String, required: true })
  pageTitle!: String

  documentName: String = ''

  @Prop({ type: Edital!, default: null })
  edital!: Edital

  title: String = ''
  document: File | null = null

  get canSave (): Boolean {
    return this.title.length > 0 && (document !== null || this.documentName.length > 0)
  }

  rules = {
    title: {
      required: (value: String) => !!value || 'Por favor, adicione um título.'
    }
  }

  publish (): void {
    this.addDocument()
    const news = this.createEdtial()
    this.$emit('saveEdital', news)
  }

  async addDocument (): Promise<String> {
    if (this.document) {
      return await editaisStore.addDocument(this.document)
    }
    return ''
  }

  getDocument (document: File): void {
    this.document = document
  }

  getDocumentPath (): String {
    const bucket = 'editais'
    if (this.document) {
      return `${bucket}/${this.document?.name}`
    } else if (this.documentName.length > 0) {
      return `${bucket}/${this.documentName}`
    }

    return ''
  }

  createEdtial (): Edital {
    const documentPath = this.getDocumentPath()

    return {
      uid: this.edital?.uid ?? undefined,
      title: this.title,
      lastModified: Date.now(),
      user: userStore.authUser,
      documentPath
    }
  }

  mounted () {
    if (this.edital) {
      this.title = this.edital.title!
      this.documentName = this.edital.documentPath?.split('/')[1]! ?? ''
    }
  }
}
</script>
