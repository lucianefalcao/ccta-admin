<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title class="mb-5">
        <h2>Perfil</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" align-self="center">
            <v-text-field
              dense
              outlined
              label="Nome"
            />

            <v-text-field
              dense
              outlined
              label="Email"
            />

            <v-text-field
              dense
              outlined
              label="Senha"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-img src="/account.svg" contain max-height="250" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn depressed color="primary">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
