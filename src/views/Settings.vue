<template>
  <Card
    title="Update Profile"
    >
    <v-card>
      <v-card-title>Update Credentials</v-card-title>
    </v-card>
    <AuthForm
      v-if="oauth"
      mode="oauth-me"/>
    <AuthForm
      v-else
      mode="me"/>

    <v-divider />
    <v-card>
      <v-card-title
        v-if="!oauth"
        >Update Password</v-card-title>
    </v-card>
    <AuthForm
      v-if="!oauth"
      mode="updatepassword"/>
    <v-divider />
    <DeleteUser />
  </Card>
</template>

<script>
// @ is an alias to /src
import Card from '@/components/Card.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import DeleteUser from '@/components/auth/DeleteUser.vue'
import VueCookies from 'vue-cookies'

export default {
  name: 'Home',
  components: {
    AuthForm,
    Card,
    DeleteUser
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
