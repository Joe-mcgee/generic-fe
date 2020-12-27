<template>
  <v-container
    fluid
    fill-height
    >
    <v-row
      align="center"
      justify="center"
      height="100vh"
      >
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        >
        <v-sheet
          color="grey lighten-5"
          elevation="6"
          >
          <v-card>
            <v-img
              src="@/assets/Flower-Life.jpg"
              class="white--text align-end"
              >
              <v-card-title>{{title}}</v-card-title>
            </v-img>
          </v-card>
          <v-form
            class="pa-3"
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-if="mode !== modeOptions.EDITPASSWORD"
              v-model="name"
              :counter="100"
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


            <v-checkbox
              v-if="mode === modeOptions.REGISTER"
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              required
              >
              <span slot="label">
                <a
                  @click.stop
                  target="_blank"
                  href="http://www.example.com">Terms and Conditions</a></span>
            </v-checkbox>

            <v-btn
              block
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
        </v-sheet>
      </v-col>
    </v-row>
  <v-snackbar
    v-model="registerSuccess"
    top
    color="green"
    >
    {{ successMessage }}
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="registerFailure"
    >
    {{ errorMessage }}
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
      title: '',
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
        v => (v && v.length <= 100) || 'Name must be less than 100 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      checkbox: false,
      userId: null,
      errorMessage: '',
      successMessage: '',
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
          this.title = 'Register'
          break
        case 'me':
          this.title = 'Update Profile'
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
          this.title= 'Update Password'
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
            switch (this.mode) {
              case this.modeOptions.REGISTER:
                data = {
                  name: this.$data.name,
                  email: this.$data.email,
                  password: this.$data.password,
                  role: 'user'
                }
                response = await authService.register(data)
                if (response.success) {
                  this.successMessage = 'Registration Successful'
                  bus.$emit('registerSuccess', response)
                  this.$router.replace('/registersuccess')
                } else {
                  this.errorMessage = response.error
                  bus.$emit('registerFailure', {})
                  this.$data.valid = !this.valid
                  this.$refs.form.resetValidation()
                }
                return
              case this.modeOptions.EDITPROFILE:
                data = {
                  name: this.$data.name,
                  email: this.$data.email
                }
                response = await authService.updateDetails(data)
                this.successMessage = 'Profile Update Successful'
                break;
              case this.modeOptions.EDITPASSWORD:
                data = {
                  currentPassword: this.$data.currentPassword,
                  newPassword: this.$data.password
                }
                response = await authService.updatePassword(data)
                this.successMessage = 'Update Password Successful'
            }

            if (response.success) {
              bus.$emit('registerSuccess', response)
            } else {
              this.errorMessage = response.error
              bus.$emit('registerFailure', {})
              this.$data.valid = !this.valid
              this.$refs.form.resetValidation()
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
