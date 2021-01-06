<template>
  <Card
    title="Register"
    >
    <AuthForm mode="register"/>
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
