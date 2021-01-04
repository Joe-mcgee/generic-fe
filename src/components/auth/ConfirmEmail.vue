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
              <v-card-title>Email Confirmation</v-card-title>
            </v-img>
          </v-card>
          <p class="text-center ma-1 pa-3">
            Thank you for confirming your email, you can now login!
          </p>
          <v-divider>
          </v-divider>
          <p class="text-center pa-3">
            <router-link to="/login">
              Login
            </router-link>
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      loginSuccess: false,
      loginFailure: false,
      valid: true,
      errorMessage: '',
    }),
  }
</script>
