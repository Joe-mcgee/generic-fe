<template>
  <v-container>
      <v-btn
        block
        :loading="loading"
        :disabled="!valid"
        color="indigo"
        outlined
        class="mr-4"
        @click="validate"
      >
      <v-icon
        left
        dark
        >
        {{icon}}
      </v-icon>
        Login with {{name}}
      </v-btn>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
export default {
  props: {
    id: String,
    icon: String,
    name: String,
  },
  data: () => ({
    loading: false,
    valid: true,
    registerSuccess: false,
    registerFailure: false,
  }),
  methods: {
    async validate () {
      this.loading = true
      const response = await authService.oAuthLogin(this.$props.id)
      if (response.success) {
        this.loading = false 
        window.location.replace(response.data.loginUrl)
      } else {
        this.loading = false 
        this.valid = !this.valid
      }

    },
  }

}
</script>
