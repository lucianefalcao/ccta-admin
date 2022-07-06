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
        :nome="capaNome"
        titulo-padrao="Capa"
        tipos-aceitos="image/jpeg, image/png"
        @arquivo="getCapa"
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

      <editor
        v-model="texto"
        api-key="no-api-key"
        :init="editorConfig"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="podeSalvarComoRascunho"
        depressed
        color="secondary"
        :disabled="!podeSalvar || carregando"
        :loading="carregando"
        @click="salvarComoRascunho"
      >
        Salvar como rascunho
      </v-btn>
      <v-btn
        depressed
        :disabled="!podeSalvar || carregando"
        :loading="carregando"
        color="primary"
        @click="publicar"
      >
        Publicar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'
import { v4 } from 'uuid'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import UploadArquivoBotao from '~/components/UploadArquivoBotao.vue'
import { noticiaStore, usuarioStore } from '~/store'
import Noticia, { NoticiaEstado } from '~/src/aplicacao/noticias/entidade/noticia'

@Component({
  components: {
    Editor,
    BotaoVoltar,
    UploadArquivoBotao
  }
})
export default class NoticiaEditor extends Vue {
  @Prop({ type: String, required: true })
  tituloPagina: string

  @Prop({ type: Noticia, default: null })
  noticia: Noticia

  @Prop({ type: Boolean, default: false })
  carregando: boolean

  capaNome = ''
  titulo = ''
  texto = ''
  capa: File | null = null
  capaModificada = false

  editorConfig = {
    language: 'pt_BR',
    min_height: 500,
    menubar: false,
    plugins: [
      'advlist autolink lists link image wordcount emoticons',
      'searchreplace fullscreen autoresize paste'
    ],
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent link | searchreplace fullscreen emoticons',
    advlist_bullet_styles: 'circle',
    advlist_number_styles: 'default,lower-alpha,lower-roman',
    default_link_target: '_blank',
    link_assume_external_targets: 'https'
  }

  get podeSalvar (): boolean {
    return this.regras.titulo.every(regra => regra(this.titulo) === true) && this.texto.length > 0
  }

  get podeSalvarComoRascunho (): boolean {
    if (!this.noticia) {
      return true
    }
    return this.noticia.getEstado() === NoticiaEstado.RASCUNHO
  }

  regras = {
    titulo: [
      (value: string): boolean|string => !!value || 'Por favor, adicione um título.'
    ]
  }

  limparTexto (): void {
    this.texto = this.texto.split('<p>&nbsp;</p>').join('<br>')
    this.texto = this.texto.split('&nbsp;').join(' ')
  }

  getCapa (capa: File): void {
    if (this.noticia !== null && !this.capaModificada && this.capaNome.length > 0) {
      noticiaStore.deletarCapa(`noticiasCapa/${this.capaNome}`)
      this.capaModificada = true
    }
    this.capaNome = ''
    this.capa = capa
  }

  getCaminhoCapa (): string {
    const bucket = 'noticiasCapa'
    if (this.capa) {
      return `${bucket}/${this.capa?.name}`
    } else if (this.capaNome.length > 0) {
      return `${bucket}/${this.capaNome}`
    }

    return ''
  }

  criarNoticia (estado: NoticiaEstado): Noticia {
    const caminhoCapa = this.getCaminhoCapa()
    const publicadoEm = estado === NoticiaEstado.PUBLICADO ? new Date() : null
    const usuario = usuarioStore.usuario.getId()

    return new Noticia(
      v4(),
      this.titulo.trim(),
      this.texto,
      estado,
      usuario,
      new Date(),
      publicadoEm,
      estado === NoticiaEstado.PUBLICADO ? usuario : null,
      caminhoCapa.length > 0 ? caminhoCapa : null
    )
  }

  publicar (): void {
    this.limparTexto()
    let noticia
    if (!this.noticia) {
      noticia = this.criarNoticia(NoticiaEstado.PUBLICADO)
    } else {
      this.editarEdital(NoticiaEstado.PUBLICADO)
      noticia = this.noticia
    }
    this.$emit('salvarNoticia', noticia, this.capa)
  }

  salvarComoRascunho (): void {
    this.limparTexto()
    let noticia
    if (!this.noticia) {
      noticia = this.criarNoticia(NoticiaEstado.RASCUNHO)
    } else {
      this.editarEdital(NoticiaEstado.RASCUNHO)
      noticia = this.noticia
    }
    this.$emit('salvarNoticia', noticia, this.capa)
  }

  editarEdital (estado: NoticiaEstado): void {
    const caminhoCapa = this.getCaminhoCapa()
    const usuario = usuarioStore.usuario.getId()
    if (this.titulo.trim() !== this.noticia.getTitulo()) {
      this.noticia.modificarTitulo(this.titulo.trim(), usuario)
    }

    if (this.texto !== this.noticia.getTexto()) {
      this.noticia.modificarTexto(this.texto, usuario)
    }

    this.noticia.modificarCapa(caminhoCapa, usuario)

    if ((estado === NoticiaEstado.PUBLICADO) && (this.noticia.getEstado() !== NoticiaEstado.PUBLICADO)) {
      this.noticia.publicar(usuario)
    }
  }

  mounted (): void {
    if (this.noticia) {
      this.titulo = this.noticia.getTitulo()
      this.texto = this.noticia.getTexto()
      this.capaNome = this.noticia.getCapa()?.split('/')[1] ?? ''
    }
  }
}
</script>
