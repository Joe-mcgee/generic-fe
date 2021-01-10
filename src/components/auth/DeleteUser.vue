<template>
  <v-container
    class="pa-3"
    fluid
    fill-height>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          block
          color="error"
          v-bind="attrs"
          v-on="on"
        >
           Delete User
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
        Warning, Permanent Operation
        </v-card-title>

        <v-card-text>
          Clicking confirm here will delete data associated with your account, one will not be able to login or retreive old information. Continue?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="validate"
          >
            Delete User
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    data: () => ({
      userId: '',
      dialog: false,
      deleteSuccess: false,
      deleteFailure: false,
      valid: true,
    }),
    async created() {
      bus.$on('deleteSuccess', (event) => {
        this.deleteSuccess = true
        console.log(event)
      }) 
      bus.$on('deleteFailure', (event) => {
        console.log(event)
        this.deleteFailure = true
      })
      let response = await authService.getMe()
      if (response.success) {
        this.userId = response.data['_id']
      }
    },
    methods: {
      async validate () {
          let response
          try {
            console.log(this.userId)
            const data = {
              id: this.userId
            }
            response = await authService.deleteUser(data)
          } catch (e) {

            bus.$emit('deleteFailure', {})
            this.valid = !this.valid
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
