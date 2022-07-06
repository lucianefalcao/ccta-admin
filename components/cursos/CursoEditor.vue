<template>
  <v-card class="pa-5">
    <v-card-actions>
      <botao-voltar />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ tituloPagina }}</h3>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="nome"
        label="Nome"
        :rules="regras.nome"
        maxlength="60"
        counter
        required
        outlined
        class="mb-5"
      />

      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-select
            v-model="tipo"
            :items="tipos"
            :rules="regras.tipo"
            item-text="label"
            item-value="chave"
            attach
            outlined
            label="Tipo"
          />
        </v-col>
        <v-col
          v-if="tipo"
          cols="12"
          sm="6"
        >
          <v-select
            v-model="subtipo"
            :items="subtipos[tipo]"
            :rules="regras.subtipo"
            item-text="label"
            item-value="chave"
            attach
            outlined
            label="Subtipo"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-select
            v-model="turno"
            :items="turnos"
            :rules="regras.turno"
            item-text="label"
            item-value="key"
            attach
            outlined
            label="Turno"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model.number="nrPeriodos"
            label="Número de períodos"
            :rules="regras.nrPeriodos"
            type="number"
            outlined
          />
        </v-col>
      </v-row>

      <v-textarea
        v-model="descricao"
        label="Descrição"
        :rules="regras.descricao"
        :counter="600"
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
import { v4 } from 'uuid'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import { usuarioStore } from '~/store'
import Curso, { CursoSubTipoGraduacao, CursoSubTipoPosGraduacao, CursoTipo, CursoTurno } from '~/src/aplicacao/cursos/entidade/curso'

@Component({
  components: {
    BotaoVoltar
  }
})
export default class CursoEditor extends Vue {
  @Prop({ type: String, required: true })
  tituloPagina!: string

  @Prop({ type: Curso, default: null })
  curso: Curso

  @Prop({ type: Boolean, default: false })
  carregando: boolean

  nome = ''
  descricao = ''
  nrPeriodos = 1
  turno: CursoTurno = null
  tipo: CursoTipo = null
  subtipo: CursoSubTipoGraduacao|CursoSubTipoPosGraduacao = null

  regras = {
    nome: [(value: string): boolean|string => !!value || 'Por favor, adicione um nome.'],
    tipo: [(value: string): boolean|string => !!value || 'Por favor, escolha um tipo.'],
    subtipo: [(value: string): boolean|string => !!value || 'Por favor, escolha um subtipo.'],
    nrPeriodos: [(value: number): boolean|string => !!value || 'Por favor, adicione a quantidade de períodos.'],
    turno: [(value: string): boolean|string => !!value || 'Por favor, escolha um turno.'],
    descricao: [
      (value: string): boolean|string => !!value || 'Por favor, adicione uma breve descrição.',
      (value: string): boolean|string => value.length < 600 || 'Máximo 400 caracteres']
  }

  tipos: {chave: CursoTipo, label: string}[] = [
    { chave: CursoTipo.GRADUACAO, label: 'Graduação' },
    { chave: CursoTipo.POS_GRADUACAO, label: 'Pós-graduação' }
  ]

  subtipos = {
    [CursoTipo.GRADUACAO]: [
      { chave: CursoSubTipoGraduacao.BACHARELADO, label: 'Bacharelado' },
      { chave: CursoSubTipoGraduacao.LICENCIATURA, label: 'Licenciatura' },
      { chave: CursoSubTipoGraduacao.TECNOLOGO, label: 'Tecnólogo' }
    ],
    [CursoTipo.POS_GRADUACAO]: [
      { chave: CursoSubTipoPosGraduacao.ESPECIALIZACAO, label: 'Especialização' },
      { chave: CursoSubTipoPosGraduacao.MBA, label: 'MBA' },
      { chave: CursoSubTipoPosGraduacao.MESTRADO, label: 'Mestrado' },
      { chave: CursoSubTipoPosGraduacao.DOUTURADO, label: 'Doutorado' },
      { chave: CursoSubTipoPosGraduacao.POS_DOUTORADO, label: 'Pós-doutorado' }
    ]
  }

  turnos: {key: string, label: string}[] = [
    { key: CursoTurno.MANHA, label: 'Manhã' },
    { key: CursoTurno.TARDE, label: 'Tarde' },
    { key: CursoTurno.INTEGRAL, label: 'Integral' },
    { key: CursoTurno.NOITE, label: 'Noite' }
  ]

  get podeSalvar (): boolean {
    const name = this.regras.nome.every(regra => regra(this.nome) === true)
    const descricao = this.regras.descricao.every(regra => regra(this.descricao) === true)
    const turno = this.regras.turno.every(regra => regra(this.turno) === true)
    const nrPeriodos = this.regras.nrPeriodos.every(regra => regra(this.nrPeriodos) === true)
    const tipo = this.regras.tipo.every(regra => regra(this.tipo) === true)
    const subtipo = this.regras.subtipo.every(regra => regra(this.subtipo) === true)

    return name && descricao && turno && nrPeriodos && tipo && subtipo
  }

  criarCurso (): Curso {
    return new Curso(
      v4(),
      this.nome.trim(),
      this.descricao.trim(),
      this.tipo,
      this.subtipo,
      this.nrPeriodos,
      usuarioStore.usuario.getId(),
      this.turno
    )
  }

  publicar (): void {
    let curso
    if (!this.curso) {
      curso = this.criarCurso()
    } else {
      this.editarCurso()
      curso = this.curso
    }
    this.$emit('salvarCurso', curso)
  }

  editarCurso (): void {
    if (this.descricao.trim() !== this.curso.getDescricao()) {
      this.curso.modificarDescricao(this.descricao.trim(), usuarioStore.usuario.getId())
    }

    if (this.nome.trim() !== this.curso.getNome()) {
      this.curso.modificarNome(this.nome.trim(), usuarioStore.usuario.getId())
    }

    if (this.nrPeriodos !== this.curso.getPeriodos()) {
      this.curso.modificarPeriodos(this.nrPeriodos, usuarioStore.usuario.getId())
    }

    if (this.turno !== this.curso.getTurno()) {
      this.curso.modificarTurno(this.turno, usuarioStore.usuario.getId())
    }

    if (this.tipo !== this.curso.getTipo()) {
      this.curso.modificarTipo(this.tipo, usuarioStore.usuario.getId())
    }

    if (this.subtipo !== this.curso.getSubtipo()) {
      this.curso.modificarSubtipo(this.subtipo, usuarioStore.usuario.getId())
    }
  }

  mounted (): void {
    if (this.curso) {
      this.nome = this.curso.getNome()
      this.descricao = this.curso.getDescricao()
      this.nrPeriodos = this.curso.getPeriodos()
      this.turno = this.curso.getTurno()
      this.tipo = this.curso.getTipo()
      this.subtipo = this.curso.getSubtipo()
    }
  }
}
</script>
