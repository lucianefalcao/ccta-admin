<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title class="text-h4">
        Permissões
      </v-card-title>

      <v-card-title class="pb-0">
        {{ user.name }}
      </v-card-title>
      <v-card-text class="text-subtitle-1">
        {{ user.email }}
      </v-card-text>

      <v-card-text>
        <v-row justify="start">
          <v-col
            v-for="(item,i) in 5"
            :key="i"
            sm="6"
            cols="12"
          >
            <v-card outlined>
              <v-card-text>
                <v-row justify="space-between" align="center">
                  <v-col class="text-body-1">
                    Gerenciar usuários
                  </v-col>
                  <v-col class="pa-0">
                    <v-switch color="success" />
                  </v-col>
                </v-row>

                <v-divider />

                <div class="text--primary pt-2">
                  O usuário com esta permissão poderá cadastrar e excluir usuários, assim como alterar as permissões.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import User from '~/models/domain/User'
import { userStore } from '~/store'

@Component
export default class Permission extends Vue {
  user: User = {
    uid: undefined,
    name: undefined,
    email: undefined,
    permissions: []
  }

  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async mounted (): Promise<void> {
    try {
      this.user = await userStore.getUserByUid(this.$route.params.uid)
    } catch (e) {
      this.errorMessage = 'Ocorreu um erro ao buscar o usuário. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
