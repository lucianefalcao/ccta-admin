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

    <v-btn v-if="cover || coverName.length > 0" icon small @click="clearFileSelection">
      <v-icon right>
        {{ icons.mdiClose }}
      </v-icon>
    </v-btn>

    <input
      ref="uploader"
      class="d-none"
      type="file"
      accept="image/jpeg, image/png"
      @change="onFileChanged"
    >
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiUpload, mdiClose } from '@mdi/js'

@Component
export default class UploadImageButton extends Vue {
  isSelectingFile: Boolean = false

  @Prop({ type: String, default: '' })
  coverName!: String

  cover: File | null = null

  icons = {
    mdiUpload,
    mdiClose
  }

  get buttonText (): String {
    if (this.coverName.length > 0) {
      return this.coverName
    }
    return this.cover ? this.cover.name : 'Capa'
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
    this.cover = target.files![0]

    this.$emit('cover', this.cover)
  }

  clearFileSelection (): void {
    this.cover = null
    this.coverName = ''
    this.$emit('cover', null)
  }
}
</script>
