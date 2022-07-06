<template>
  <v-card class="pa-5">
    <v-card-actions>
      <botao-voltar />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ tituloPagina }}</h3>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            v-model="titulo"
            label="Título"
            :rules="regras.titulo"
            maxlength="60"
            counter
            required
            outlined
            class="mb-5"
          />
        </v-col>

        <v-col
          cols="12"
          sm="4"
        >
          <v-datetime-picker
            v-model="datetime"
            label="Data do evento"
            date-format="dd/MM/yyyy"
            :date-picker-props="dateProps"
            :time-picker-props="timeProps"
            :text-field-props="textoProps"
          >
            <template slot="dateIcon">
              <v-icon>mdi-calendar</v-icon>
            </template>
            <template slot="timeIcon">
              <v-icon>mdi-clock-outline</v-icon>
            </template>

            <template slot="actions" slot-scope="{ parent }">
              <v-btn text color="secondary" @click.native="parent.clearHandler">
                Limpar
              </v-btn>
              <v-btn text color="primary" @click="parent.okHandler">
                Ok
              </v-btn>
            </template>
          </v-datetime-picker>
        </v-col>
      </v-row>
      <v-textarea
        v-model="descricao"
        label="Descrição"
        :rules="regras.descricao"
        :counter="200"
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
import Evento from '~/src/aplicacao/eventos/entidade/evento'

@Component({
  components: {
    BotaoVoltar
  }
})
export default class EventoEditor extends Vue {
  @Prop({ type: String, required: true })
  tituloPagina: string

  @Prop({ type: Evento, default: null })
  evento: Evento

  @Prop({ type: Boolean, default: false })
  carregando: boolean

  titulo = ''
  descricao = ''

  regras = {
    titulo: [
      (value: string): boolean|string => !!value || 'Por favor, adicione um título.'
    ],
    descricao: [
      (value: string): boolean|string => !!value || 'Por favor, adicione uma breve descrição.',
      (value: string): boolean|string => value.length < 200 || 'Máximo 200 caracteres'
    ],
    data: [
      (value: Date): boolean|string => !!value || 'Por favor, adicione a data do evento.'
    ]
  }

  datetime: Date = new Date()
  dateProps = {
    headerColor: 'primary',
    color: 'secondary',
    locale: 'pt-br'
  }

  timeProps = {
    headerColor: 'primary',
    color: 'secondary',
    format: '24hr'
  }

  textoProps = {
    rules: this.regras.data,
    outlined: true,
    width: '100px'
  }

  get podeSalvar (): boolean {
    const tituloValido = this.regras.titulo.every(regra => regra(this.titulo) === true)
    const descricaoValida = this.regras.descricao.every(regra => regra(this.descricao) === true)
    const dataValida = this.regras.data.every(regra => regra(this.datetime) === true)
    return tituloValido && descricaoValida && dataValida
  }

  publicar (): void {
    let evento
    if (!this.evento) {
      evento = this.criarEvento()
    } else {
      this.editarEvento()
      evento = this.evento
    }
    this.$emit('criarEvento', evento)
  }

  criarEvento (): Evento {
    return new Evento(
      v4(),
      this.titulo.trim(),
      this.descricao.trim(),
      usuarioStore.usuario.getId(),
      this.datetime
    )
  }

  editarEvento (): void {
    this.evento.modificarTitulo(this.titulo.trim(), usuarioStore.usuario.getId())
    this.evento.modificarDescricao(this.descricao.trim(), usuarioStore.usuario.getId())
    this.evento.modificarData(this.datetime, usuarioStore.usuario.getId())
  }

  mounted (): void {
    if (this.evento) {
      this.titulo = this.evento.getTitulo()
      this.datetime = this.evento.getData()
      this.descricao = this.evento.getDescricao()
    }
  }
}
</script>
