<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-actions class="mb-10">
        <botao-voltar rota="/noticias" />
        <v-spacer />
        <v-btn
          depressed
          color="secondary"
          @click="editar"
        >
          Editar
        </v-btn>
        <v-btn
          v-if="!estaPublicado"
          depressed
          color="primary"
          @click="publicar"
        >
          Publicar
        </v-btn>
      </v-card-actions>

      <v-card-text class="text-center">
        <v-img contain :src="capaLink" max-height="600" />
      </v-card-text>

      <v-card-title style="word-break: break-word;">
        <h2>
          {{ titulo }}
        </h2>
      </v-card-title>
      <v-card-text class="mb-5">
        <noticia-estado-chip :estado-item="estado" :is-outlined="true" />
        <div>
          Criado por {{ nomeUsuarioCriador }} &bull; criado em {{ criadoEm }}
        </div>
        <div v-if="estaPublicado">
          Publicado por {{ nomeUsuarioPublicador }} &bull; publicado em {{ criadoEm }}
        </div>
        <div v-if="editadoEm">
          Editado por {{ nomeUsuarioEditor }} &bull; última atualização {{ editadoEm }}
        </div>
      </v-card-text>

      <v-card-text class="black--text">
        <div v-html="texto" />
      </v-card-text>
    </v-card>

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :mensagem="mensagemErro"
      @fecharSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { noticiaStore, usuarioStore } from '~/store'
import Noticia, { NoticiaEstado } from '~/src/aplicacao/noticias/entidade/noticia'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import Snackbar from '~/components/Snackbar.vue'
import NoticiaEstadoChip from '~/components/noticias/NoticiaEstadoChip.vue'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'

@Component({
  components: {
    BotaoVoltar,
    Snackbar,
    NoticiaEstadoChip
  }
})
export default class NoticiaUid extends Vue {
  noticia: Noticia = null
  usuarioCriador: Usuario
  usuarioEditor: Usuario
  usuarioPublicador: Usuario

  capaLink = ''
  mensagemErro = ''
  buscandoDados = true
  estaPublicado = false
  snackbar = false

  get criadoEm (): string {
    return this.noticia?.getCriadoEm().toLocaleDateString('pt-BR') ?? ''
  }

  get editadoEm (): string {
    return this.noticia?.getEditadoEm()?.toLocaleDateString('pt-BR') ?? ''
  }

  get publicadoEm (): string {
    return this.noticia?.getPublicadoEm()?.toLocaleDateString('pt-BR') ?? ''
  }

  get titulo (): string {
    return this.noticia?.getTitulo() ?? ''
  }

  get texto (): string {
    return this.noticia?.getTexto() ?? ''
  }

  get estado (): NoticiaEstado|string {
    console.log(this.noticia)
    return this.noticia?.getEstado() ?? ''
  }

  get nomeUsuarioCriador (): string {
    return this.usuarioCriador?.getNome() ?? 'Usuário não identificado'
  }

  get nomeUsuarioEditor (): string {
    return this.usuarioEditor?.getNome() ?? 'Usuário não identificado'
  }

  get nomeUsuarioPublicador (): string {
    return this.usuarioPublicador?.getNome() ?? 'Usuário não identificado'
  }

  editar (): void {
    this.$router.push('/noticias/editar/' + this.noticia.getId())
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async publicar (): Promise<void> {
    try {
      this.noticia.publicar(usuarioStore.usuario.getId())
      await noticiaStore.atualizar({ noticia: this.noticia, capa: null })
      if (this.noticia.getPublicadoPor()) {
        this.usuarioPublicador = await usuarioStore.getUsuarioPorId(this.noticia.getPublicadoPor())
      }
      this.estaPublicado = true
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao publicar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!noticiaStore.context) {
        this.noticia = await noticiaStore.getNoticiaPorId(this.$route.params.uid)
      } else {
        this.noticia = noticiaStore.context.rootState.noticias.noticiaSelecionada
      }

      if (this.noticia.getCapa()?.length > 0) {
        this.capaLink = await noticiaStore.getCapaLink(this.noticia.getCapa())
      }

      this.usuarioCriador = await usuarioStore.getUsuarioPorId(this.noticia.getCriadoPor())
      if (this.noticia.getEditadoPor()) {
        this.usuarioEditor = await usuarioStore.getUsuarioPorId(this.noticia.getEditadoPor())
      }

      if (this.noticia.getPublicadoPor()) {
        this.usuarioPublicador = await usuarioStore.getUsuarioPorId(this.noticia.getPublicadoPor())
      }

      if (this.noticia.getEstado() === NoticiaEstado.PUBLICADO) {
        this.estaPublicado = true
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
