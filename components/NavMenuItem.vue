<template>
  <v-list-item
    class="ps-6"
    :to="to"
    active-class="primary white--text"
    link
  >
    <v-list-item-icon class="mr-5">
      <v-icon class="mx-auto">
        {{ icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class NavMenuItem extends Vue {
  @Prop({ type: String, required: true, default: '' })
  title!: String

  @Prop({ type: String, required: true })
  icon!: String

  @Prop({ type: String })
  to!: String
}
</script>
