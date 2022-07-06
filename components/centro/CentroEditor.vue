<template>
  <v-card class="pa-5">
    <v-card-actions>
      <botao-voltar />
    </v-card-actions>
    <v-card-title class="mb-5">
      <h3>{{ tituloPagina }}</h3>
    </v-card-title>
    <v-card-text>
      <v-textarea
        v-model="descricao"
        label="Sobre o centro"
        :rules="regras.descricao"
        :counter="400"
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
import Centro from '~/src/aplicacao/centro/entidade/centro'

@Component({
  components: {
    BotaoVoltar
  }
})
export default class CentroEditor extends Vue {
  @Prop({ type: String, required: true })
  tituloPagina: string

  @Prop({ type: Centro, default: null })
  centro: Centro

  @Prop({ type: Boolean, default: false })
  carregando: boolean

  descricao = ''

  regras = {
    descricao: [
      (value: string): boolean|string => !!value || 'Por favor, adicione uma breve descrição.',
      (value: string): boolean|string => value.length < 400 || 'Máximo 400 caracteres'
    ]
  }

  get podeSalvar (): boolean {
    return this.regras.descricao.every(regra => regra(this.descricao) === true)
  }

  criarCentro (): Centro {
    return new Centro(
      v4(),
      this.descricao,
      usuarioStore.usuario.getId(),
      new Date()
    )
  }

  publicar (): void {
    let centro
    if (!this.centro) {
      centro = this.criarCentro()
    } else {
      this.editarEdital()
      centro = this.centro
    }
    this.$emit('salvarCentro', centro)
  }

  editarEdital (): void {
    this.centro.modificarDescricao(this.descricao, usuarioStore.usuario.getId())
  }

  mounted (): void {
    if (this.centro) {
      this.descricao = this.centro.getDescricao()
    }
  }
}
</script>
