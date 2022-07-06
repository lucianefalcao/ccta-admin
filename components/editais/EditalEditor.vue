<template>
  <v-card class="pa-5">
    <v-card-actions>
      <botao-voltar />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ tituloPagina }}</h3>
    </v-card-title>
    <v-card-text>
      <upload-arquivo-botao
        :nome="nomeDocumento"
        titulo-padrao="Documento"
        tipos-aceitos="application/pdf"
        @arquivo="getDocumento"
      />

      <v-text-field
        v-model="titulo"
        label="Título"
        :rules="regras.titulo"
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
        :disabled="!podeSalvar || carregando"
        color="primary"
        :loading="carregando"
        @click="publicar"
      >
        Publicar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { v4 } from 'uuid'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import UploadArquivoBotao from '~/components/UploadArquivoBotao.vue'
import { editalStore, usuarioStore } from '~/store'
import Edital from '~/src/aplicacao/editais/entidade/edital'

@Component({
  components: {
    BotaoVoltar,
    UploadArquivoBotao
  }
})
export default class EditalEditor extends Vue {
  @Prop({ type: String, required: true })
  tituloPagina: string

  @Prop({ type: Edital, default: null })
  edital: Edital

  @Prop({ type: Boolean, default: false })
  carregando: boolean

  nomeDocumento = ''
  titulo = ''
  documento: File | null = null
  documentoModificado = false

  get podeSalvar (): boolean {
    const tituloValido = this.regras.titulo.every(regra => regra(this.titulo) === true)
    const descricaoValida = this.regras.documento.every(regra => regra(this.nomeDocumento) === true)
    return tituloValido && descricaoValida
  }

  regras = {
    titulo: [
      (value: string): boolean|string => !!value || 'Por favor, adicione um título.'
    ],
    documento: [
      (value: string): boolean|string => !!value || 'Por favor, adicione um documento.'
    ]
  }

  getDocumento (documento: File): void {
    if (this.edital !== null && !this.documentoModificado) {
      editalStore.deletarDocumento(`editais/${this.nomeDocumento}`)
      this.documentoModificado = true
    }
    this.documento = documento
    this.nomeDocumento = documento ? documento.name : ''
  }

  getCaminhoDocumento (): string {
    const bucket = 'editais'
    if (this.documento) {
      return `${bucket}/${this.documento.name}`
    } else if (this.nomeDocumento.length > 0) {
      return `${bucket}/${this.nomeDocumento}`
    }

    return ''
  }

  criarEdital (): Edital {
    const caminhoDocumento = this.getCaminhoDocumento()

    return new Edital(
      v4(),
      this.titulo.trim(),
      caminhoDocumento,
      usuarioStore.usuario.getId()
    )
  }

  publicar (): void {
    let edital
    if (!this.edital) {
      edital = this.criarEdital()
    } else {
      this.editarEdital()
      edital = this.edital
    }
    this.$emit('salvarEdital', edital, this.documento)
  }

  editarEdital (): void {
    const caminhoDocumento = this.getCaminhoDocumento()
    this.edital.modificarTitulo(this.titulo.trim(), usuarioStore.usuario.getId())
    this.edital.modificarDocumento(caminhoDocumento, usuarioStore.usuario.getId())
  }

  mounted (): void {
    if (this.edital) {
      this.titulo = this.edital.getTitulo()
      this.nomeDocumento = this.edital.getDocumento().split('/')[1] ?? ''
    }
  }
}
</script>
