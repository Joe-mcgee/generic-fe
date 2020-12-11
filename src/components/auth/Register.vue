<template>
  <v-container>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
      >{{name.length >= 1 ? name : '' }}</v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      counter
      required
      >{{email.length >= 1 ? email : ''}}</v-text-field>

    <v-text-field
      v-if="!editMode"
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @click:append="show1 = !show1"
      ></v-text-field>
    

    <v-text-field
      v-if="!editMode"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min]"
      :type="show2 ? 'text' : 'password'"
      name="input-10-2"
      label="Repeat Password"
      hint="At least 8 characters"
      class="input-group--focused"
      counter
      @click:append="show2 = !show2"
    ></v-text-field>

    <v-select
      v-model="roleSelect"
      :hint="`${roleSelect.state}, ${roleSelect.abbr}`"
      :items="roleItems"
      item-text="state"
      item-value="abbr"
      label="Role"
      persistent-hint
      return-object
      single-line
    ></v-select>


    <v-checkbox
      v-if="!editMode"
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Submit
    </v-btn>

  </v-form>
  <v-snackbar
    v-model="registerSuccess"
    top
    color="green"
    >
    Registration Success!
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="registerFailure"
    >
    Opps! Something went wrong
  </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    data: () => ({
      editMode: false,
      registerSuccess: false,
      registerFailure: false,
      show1: false,
      show2: false,
      password: '',
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        //emailMatch: () => (`The email and password you entered don't match`),
      },
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      roleSelect: {
        state: 'Contributor', abbr: 'Cont', enum: 'user'
      },
      roleItems: [
        { state: 'Contributor', abbr: 'Cont', enum: 'user' },
      ],
      checkbox: false,
    }),
    async created() {
      bus.$on('registerSuccess', (event) => {
        this.registerSuccess = true
        console.log(event)
      }) 
      bus.$on('registerFailure', (event) => {
        console.log(event)
        this.registerFailure = true
      })

      let response = await authService.getMe()
      if (response.success == true) {
          this.editMode = true
          this.name = response.data.name
          this.email = response.data.email

      }

    },
    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          
          let response
          try {
            if (this.editMode) {
            const data = {
              name: this.$data.name,
              email: this.$data.email
            }
            response = await authService.updateDetails(data)
            } else {
              const data = {
                name: this.$data.name,
                email: this.$data.email,
                password: this.$data.password,
                role: this.$data.roleSelect.enum
              }
            response = await authService.register(data)
            }
          } catch (e) {

            bus.$emit('registerFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
            console.log(e)
            return
          }

          if (response.success) {
            bus.$emit('registerSuccess', response)
          }
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
