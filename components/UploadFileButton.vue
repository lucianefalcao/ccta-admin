<template>
  <div class="mb-5">
    <v-btn
      color="primary"
      class="text-none"
      :loading="isSelectingFile"
      depressed
      rounded
      @click="chooseCover"
    >
      <v-icon left>
        {{ icons.mdiUpload }}
      </v-icon>
      {{ buttonText }}
    </v-btn>

    <v-btn v-if="file || fileName.length > 0" icon small @click="clearFileSelection">
      <v-icon right>
        {{ icons.mdiClose }}
      </v-icon>
    </v-btn>

    <input
      ref="uploader"
      class="d-none"
      type="file"
      :accept="acceptTypes"
      @change="onFileChanged"
    >
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiUpload, mdiClose } from '@mdi/js'

@Component
export default class UploadFileButton extends Vue {
  isSelectingFile: Boolean = false

  @Prop({ type: String, default: '' })
  fileName!: String

  @Prop({ type: String, required: true })
  defaultTitle!: String

  @Prop({ type: String, required: true })
  acceptTypes!: String

  file: File | null = null

  icons = {
    mdiUpload,
    mdiClose
  }

  get buttonText (): String {
    if (this.fileName.length > 0) {
      return this.fileName
    }
    return this.file ? this.file.name : this.defaultTitle
  }

  chooseCover (): void {
    this.isSelectingFile = true
    window.addEventListener('focus', () => {
      this.isSelectingFile = false
    }, { once: true })

    const uploader = this.$refs.uploader as HTMLInputElement

    uploader.click()
  }

  onFileChanged (e: Event): void {
    const target = e.target as HTMLInputElement
    this.file = target.files![0]

    this.$emit('file', this.file)
  }

  clearFileSelection (): void {
    console.log('aqui')
    this.file = null
    this.$emit('file', null)
  }
}
</script>
