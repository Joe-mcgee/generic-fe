<template>
  <Card
    title="Register"
    >
    <AuthForm mode="register"/>
    <v-divider>
    </v-divider>
      <p class="text-center pa-3">
      <router-link to="/login">
        Login
      </router-link>
      </p>
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
