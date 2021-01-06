<template>
  <v-container
    px-0
    fluid
    fill-height>
    <v-btn
      block
      :disabled="!valid"
      color="error"
      class="mr-4"
      @click="validate"
    >
      Delete User
    </v-btn>
  <v-snackbar
    v-model="deleteSuccess"
    top
    color="green"
    >
    User Deleted
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="deleteFailure"
    >
    Oops! Something went wrong
  </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    props: {
      id: String,
    },
    data: () => ({
      deleteSuccess: false,
      deleteFailure: false,
      valid: true,
    }),
    created() {
      bus.$on('deleteSuccess', (event) => {
        this.deleteSuccess = true
        console.log(event)
      }) 
      bus.$on('deleteFailure', (event) => {
        console.log(event)
        this.deleteFailure = true
      }) 
    },
    methods: {
      async validate () {
          let response
          try {
            console.log(this.$props.id)
            const data = {
              id: this.$props.id
            }
            response = await authService.deleteUser(data)
          } catch (e) {

            bus.$emit('deleteFailure', {})
            this.$data.valid = !this.valid
            console.log(e)
            return
          }

          if (response.success) {
            bus.$emit('deleteSuccess', response)
            this.$router.push('/login')
          }
      },
    },
  }
</script>
