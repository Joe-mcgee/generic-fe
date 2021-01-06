<template>
  <Card
    title="Settings"
    >
    <AuthForm mode="updatepassword" />
  </Card>
</template>
<script>
import Card from '@/components/Card.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
export default {
  components: {
    AuthForm,
    Card
  },
  data: () => ({

  }),
  
}
</script>

