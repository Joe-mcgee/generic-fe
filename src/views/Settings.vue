<template>
  <Card
    title="Update Profile"
    >
    <v-divider>
    </v-divider>
    <v-card>
      <v-card-title
        >Update Credentials</v-card-title>
    </v-card>
    <v-divider>
    </v-divider>
    <AuthForm mode="me"/>
    <v-divider>
    </v-divider>
    <v-card>
      <v-card-title
        >Update Password</v-card-title>
    </v-card>
    <v-divider>
    </v-divider>
  <!--
    <v-card>
    <v-img
      :src="require('@/assets/Flower-Life.jpg')"
      class="white--text align-end darken"
      max-height="64px"
      >
      <v-card-title
        style="-webkit-text-stroke-width: 1px; -webkit-text-stroke-color: grey"
        >Update Password</v-card-title>
    </v-img>
    </v-card>
  -->
      
    <AuthForm mode="updatepassword"/>
  </Card>
</template>

<script>
// @ is an alias to /src
import Card from '@/components/Card.vue'
import AuthForm from '@/components/auth/AuthForm.vue'

export default {
  name: 'Home',
  components: {
    AuthForm,
    Card
  }
}
</script>
