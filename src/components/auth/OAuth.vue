<template>
  <v-container>
      <v-btn
        block
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

    <v-snackbar
      v-model="registerSuccess"
      top
      color="green"
      >
      {{name}} Auth Success
    </v-snackbar>
    <v-snackbar
      color="red"
      top
      v-model="registerFailure"
      >
      {{name}} Auth fail
    </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
export default {
  props: {
    id: String,
    icon: String,
    name: String,
  },
  data: () => ({
    valid: true,
    registerSuccess: false,
    registerFailure: false,
  }),
    created() {
      bus.$on('registerSuccess', (event) => {
        this.loginSuccess = true
        console.log(event)
      }) 
      bus.$on('registerFailure', (event) => {
        console.log(event)
        this.loginFailure = true
      }) 
    },
  methods: {
    async validate () {
      const response = await authService.oAuthLogin(this.$props.id)
      if (response.success) {
        
        window.location.replace(response.data.loginUrl)
        bus.$emit('registerSuccess', response)
      } else {
        bus.$emit('registerFailure', {})
        this.valid = !this.valid
      }

    },
  }

}
</script>
