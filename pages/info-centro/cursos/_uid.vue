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
        <botao-voltar rota="/info-centro" />
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
              {{ curso.getNome() }}
            </h2>
            {{ tipo }} &bull; {{ subtipo }} <span class="body-2"> ({{ turno }} &bull; {{ periodos }} períodos) </span>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="mb-2">
        Criado por {{ nomeUsuario }} &bull; última atualização {{ ultimaModificacao }}
      </v-card-text>

      <v-card-title>
        Descrição
      </v-card-title>

      <v-card-text class="black--text">
        {{ curso.getDescricao() }}
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
import { cursoStore, usuarioStore } from '~/store'
import Curso, { CursoSubTipoGraduacao, CursoSubTipoPosGraduacao, CursoTipo, CursoTurno } from '~/src/aplicacao/cursos/entidade/curso'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import Snackbar from '~/components/Snackbar.vue'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'

@Component({
  components: {
    BotaoVoltar,
    Snackbar
  }
})
export default class CursoUid extends Vue {
  curso: Curso
  usuario: Usuario

  turnos = {
    [CursoTurno.MANHA]: 'Manhã',
    [CursoTurno.TARDE]: 'Tarde',
    [CursoTurno.INTEGRAL]: 'Integral',
    [CursoTurno.NOITE]: 'Noite'
  }

  tipos = {
    [CursoTipo.GRADUACAO]: 'Graduação',
    [CursoTipo.POS_GRADUACAO]: 'Pós-graduação'
  }

  subtipos = {
    [CursoSubTipoGraduacao.BACHARELADO]: 'Bacharelado',
    [CursoSubTipoGraduacao.LICENCIATURA]: 'Licenciatura',
    [CursoSubTipoGraduacao.TECNOLOGO]: 'Tecnólogo',
    [CursoSubTipoPosGraduacao.ESPECIALIZACAO]: 'Especialização',
    [CursoSubTipoPosGraduacao.MBA]: 'MBA',
    [CursoSubTipoPosGraduacao.MESTRADO]: 'Mestrado',
    [CursoSubTipoPosGraduacao.DOUTURADO]: 'Doutorado',
    [CursoSubTipoPosGraduacao.POS_DOUTORADO]: 'Pós-doutorado'

  }

  mensagemErro = ''
  buscandoDados = true
  snackbar = false

  get ultimaModificacao (): string {
    return this.curso.getUltimaModificacao().toLocaleDateString('pt-BR')
  }

  get nome (): string {
    return this.curso?.getNome() ?? 'Sem nome'
  }

  get descricao (): string {
    return this.curso?.getDescricao() ?? 'Sem descrição'
  }

  get turno (): string {
    return this.curso ? this.turnos[this.curso.getTurno()] : 'Sem turno definido'
  }

  get tipo (): string {
    return this.curso ? this.tipos[this.curso.getTipo()] : 'Sem tipo definido'
  }

  get subtipo (): string {
    return this.curso ? this.subtipos[this.curso.getSubtipo()] : 'Sem subtipo definido'
  }

  get nomeUsuario (): string {
    return this.usuario?.getNome() ?? 'Usuário não identificado'
  }

  get periodos (): number|string {
    return this.curso ? this.curso.getPeriodos() : 'Sem períodos definidos'
  }

  editar (): void {
    this.$router.push('/info-centro/cursos/editar/' + this.curso.getId())
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async mounted (): Promise<void> {
    try {
      if (!cursoStore.context) {
        this.curso = await cursoStore.getCursoPorId(this.$route.params.uid)
      } else {
        this.curso = cursoStore.context.rootState.cursos.cursoSelecionado
      }

      this.usuario = await usuarioStore.getUsuarioPorId(this.curso.getUsuario())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
