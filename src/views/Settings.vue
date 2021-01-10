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
    <AuthForm
      v-if="oauth"
      mode="oauth-me"/>
    <AuthForm
      v-else
      mode="me"/>
    <v-divider>
    </v-divider>
    <v-card>
      <v-card-title
        v-if="!oauth"
        >Update Password</v-card-title>
    </v-card>
    <v-divider>
    </v-divider>
    <AuthForm
      v-if="!oauth"
      mode="updatepassword"/>
  </Card>
</template>

<script>
// @ is an alias to /src
import Card from '@/components/Card.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import VueCookies from 'vue-cookies'

export default {
  name: 'Home',
  components: {
    AuthForm,
    Card
  },
  data: () => ({
    oauth: false
  }),
  created() {
    if (VueCookies.get('oauth')) {
      this.oauth = true
    }
  }
}
</script>
