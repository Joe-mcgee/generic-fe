<template>
  <v-container>
    <Register mode="me"/>
    <Register mode="updatepassword"/>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Register from '@/components/auth/Register.vue'

export default {
  name: 'Home',
  components: {
    Register,
  }
}
</script>
