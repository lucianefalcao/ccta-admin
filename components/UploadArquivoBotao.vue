<template>
  <div class="mb-5">
    <v-btn
      color="primary"
      class="text-none"
      :loading="estaSelecionando"
      depressed
      rounded
      @click="escolherCapa"
    >
      <v-icon left>
        mdi-upload
      </v-icon>
      {{ textoBotao }}
    </v-btn>

    <v-btn v-if="arquivo || nome.length > 0" icon small @click="limparSelecao">
      <v-icon right>
        mdi-close
      </v-icon>
    </v-btn>

    <input
      ref="uploader"
      class="d-none"
      type="file"
      :accept="tiposAceitos"
      @change="onFileChanged"
    >
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class UploadArquivoBotao extends Vue {
  estaSelecionando = false

  @Prop({ type: String, default: '' })
  nome: string

  @Prop({ type: String, required: true })
  tituloPadrao: string

  @Prop({ type: String, required: true })
  tiposAceitos!: string

  arquivo: File | null = null

  get textoBotao (): string {
    if (this.nome.length > 0) {
      return this.nome
    }
    return this.arquivo ? this.arquivo.name : this.tituloPadrao
  }

  escolherCapa (): void {
    this.estaSelecionando = true
    window.addEventListener('focus', () => {
      this.estaSelecionando = false
    }, { once: true })

    const uploader = this.$refs.uploader as HTMLInputElement

    uploader.click()
  }

  onFileChanged (e: Event): void {
    const target = e.target as HTMLInputElement
    if (target.files[0].size > 5000000) {
      alert('Escolha um arquivo de até 5MB')
      return
    }
    this.arquivo = target.files[0]

    this.$emit('arquivo', this.arquivo)
  }

  limparSelecao (): void {
    this.arquivo = null
    this.$emit('arquivo', this.arquivo)
  }
}
</script>
