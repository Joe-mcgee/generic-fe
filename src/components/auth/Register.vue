<template>
  <v-container>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-if="mode !== modeOptions.EDITPASSWORD"
      v-model="name"
      :counter="10"
      :rules="nameRules"
      label="Name"
      required
      >{{name.length >= 1 ? name : '' }}</v-text-field>

    <v-text-field
      v-if="mode !== modeOptions.EDITPASSWORD"
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      counter
      required
      >{{email.length >= 1 ? email : ''}}</v-text-field>

    <v-text-field
      v-if="mode === modeOptions.EDITPASSWORD"
      v-model="currentPassword"
      :append-icon="show0 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min]"
      :type="show0 ? 'text' : 'password'"
      name="input-10-1"
      label="Current Password"
      @click:append="show0 = !show0"
      ></v-text-field>

    <v-text-field
      v-if="mode !== modeOptions.EDITPROFILE"
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 6 characters"
      counter
      @click:append="show1 = !show1"
      ></v-text-field>
    

    <v-text-field
      v-if="mode !== modeOptions.EDITPROFILE"
      v-model="rePassword"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min, passwordMatch]"
      :type="show2 ? 'text' : 'password'"
      name="input-10-2"
      label="Repeat Password"
      hint="At least 6 characters"
      class="input-group--focused"
      counter
      @click:append="show2 = !show2"
    ></v-text-field>

    <v-select
      v-if="mode !== modeOptions.EDITPASSWORD"
      v-model="roleSelect"
      :items="roleItems"
      item-text="state"
      item-value="abbr"
      label="Role"
      persistent-hint
      return-object
    ></v-select>


    <v-checkbox
      v-if="mode === modeOptions.REGISTER"
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
    
    <DeleteUser
      :id="userId"
      v-if="mode === modeOptions.EDITPROFILE"/>

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
import DeleteUser from '@/components/auth/DeleteUser.vue'
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    components: {
      DeleteUser,
    },
    data: () => ({
      modeOptions: {
        REGISTER: 'register',
        EDITPROFILE: 'me',
        EDITPASSWORD: 'resetpassword'
      },
      mode: null,
      registerSuccess: false,
      registerFailure: false,
      show0: false,
      show1: false,
      show2: false,
      currentPassword: '',
      password: '',
      rePassword: '',
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
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
      userId: null,
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
      console.log(this.$router.currentRoute)
      let response;
      switch (this.$router.currentRoute.name) {
        case 'register':
          this.mode = this.modeOptions.REGISTER
          break
        case 'me':
          this.mode = this.modeOptions.EDITPROFILE
          response = await authService.getMe()
          console.log(response.data['_id'])
          if (response.success == true) {
              this.name = response.data.name
              this.email = response.data.email
              this.userId = response.data['_id']
          }
          break
        case 'updatepassword':
          this.mode = this.modeOptions.EDITPASSWORD
          break
      }
    },
    computed: {
      passwordMatch() {
        return () => (this.password === this.rePassword) || 'Password must match'
      }
    },
    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          
          let response
          let data
          try {
            switch (this.mode) {
              case this.modeOptions.REGISTER:
                data = {
                  name: this.$data.name,
                  email: this.$data.email,
                  password: this.$data.password,
                  role: this.$data.roleSelect.enum
                }
                response = await authService.register(data)
                break
              case this.modeOptions.EDITPROFILE:
                data = {
                  name: this.$data.name,
                  email: this.$data.email
                }
                response = await authService.updateDetails(data)
                break;
              case this.modeOptions.EDITPASSWORD:
                data = {
                  currentPassword: this.$data.currentPassword,
                  newPassword: this.$data.password
                }
                response = await authService.updatePassword(data)
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
