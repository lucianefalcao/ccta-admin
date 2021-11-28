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
            v-for="(permission,i) in permissions"
            :key="i"
            sm="6"
            cols="12"
          >
            <v-card outlined>
              <v-card-text>
                <v-row justify="space-between" align="center">
                  <v-col class="py-0">
                    <v-switch
                      v-model="selectedPermissions"
                      :label="permission.label"
                      :value="permission.code"
                      color="success"
                    />
                  </v-col>
                </v-row>

                <v-divider />

                <div class="text--primary pt-2">
                  {{ permission.description }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          depressed
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="saveOrRemovePermission"
        >
          Salvar
        </v-btn>
      </v-card-actions>
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
import Permission from '~/models/domain/Permission'
import { permissionStore, userStore } from '~/store'

@Component
export default class PermissionDetails extends Vue {
  user: User = userStore.authUser

  errorMessage: String = ''
  snackbar: Boolean = false
  isSaving: Boolean = false

  selectedPermissions: String[] = []
  userPermissions: Permission[] = userStore.userPermissions

  permissions: {code: String, label: String, description: String}[] = [
    {
      code: 'gerenciar-usuarios',
      label: 'Gerenciar usuários',
      description: 'O usuário com está permissão poderá cadastrar e excluir outros usuários, assim como definir suas permissões.'
    },
    {
      code: 'gerenciar-eventos',
      label: 'Gerenciar eventos',
      description: 'O usuário com está permissão poderá publicar, editar e excluir eventos.'
    },
    {
      code: 'gerenciar-editais',
      label: 'Gerenciar editais',
      description: 'O usuário com está permissão poderá publicar, editar e excluir editais.'
    },
    {
      code: 'gerenciar-noticias',
      label: 'Gerenciar notícias',
      description: 'O usuário com está permissão poderá cadastrar, editar e excluir notícias.'
    },
    {
      code: 'gerenciar-info-centro',
      label: 'Gerenciar informações do centro',
      description: 'O usuário com está permissão poderá cadastrar, editar e excluir informações do centro.'
    },
    {
      code: 'gerenciar-configuracoes',
      label: 'Gerenciar configurações',
      description: 'O usuário com está permissão poderá alterar a logo no site.'
    }
  ]

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveOrRemovePermission () {
    try {
      this.isSaving = true
      const removeItems = this.userPermissions.filter(item => !this.selectedPermissions.includes(item.code!))
      const userPermissionsCodes = this.userPermissions.map(item => item.code) as String[]
      const saveItems = this.selectedPermissions.filter((item: String) => !userPermissionsCodes.includes(item))

      for (const item of saveItems) {
        await permissionStore.setPermission({ uid: undefined, code: item, user: this.user })
      }

      for (const item of removeItems) {
        await permissionStore.remove(item)
      }

      this.userPermissions = await permissionStore.getPermissionsByUserUid(this.user.uid!)
      userStore.updateUserPermissions(this.userPermissions)

      this.$router.push('/users')
    } catch (error) {
      this.errorMessage = 'Não foi possível salvar as alterações. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.isSaving = false
    }
  }

  mounted (): void {
    try {
      this.selectedPermissions = this.userPermissions.map(item => item.code) as String[]
    } catch (e) {
      this.errorMessage = 'Ocorreu um erro ao buscar o usuário. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
