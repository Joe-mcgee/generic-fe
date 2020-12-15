import http from "@/services/http-common.js"
import VueCookies from 'vue-cookies'
class AuthService {
  async googleLogin(data) {
    let response = await http.get('/auth/google', data)
    console.log(response)
    if (response.data.success) {
      console.log(response.data)
      let googleAuth = await http.get(response.data.googleLoginUrl)
      console.log(googleAuth)
      console.log('some notion of setting jwt')
    }
    return response.data
  }
  async facebookLogin(data) {
    let response = await http.get('/auth/facebook', data)
    console.log(response)
    if (response.data.success) {
      console.log(response.data)
      let facebookAuth = await http.get(response.data.facebookLoginUrl)
      console.log(facebookAuth)
      console.log('some notion of setting jwt')
    }
    return response.data
  }
  async register(data) {
    let response = await http.post('/auth/register', data)
    console.log(response)
    return response.data
  }
  async login(data) {
    let response = await http.post('/auth/login', data)
    console.log(response)
    if (response.data.success == true) {
      VueCookies.set('token', response.data.token, "1h")
    }
    return response.data
  }
  async resendEmail(data) {
    let response = await http.post('/auth/resendconfirmemail', data)
    console.log(response)
    return response.data
  }
  async forgotPassword(data) {
    let response = await http.post('/auth/forgotpassword/', data)
    console.log(response)
    return response.data
  }
  async resetPassword(data) {
    let response = await http.put(`/auth/resetpassword/${data.resettoken}`, data)
    console.log(response)
    return response.data
  }
  async logout() {
    let response = await http.get('/auth/logout')
    console.log(response)
    if (response.data.success == true) {
      VueCookies.remove('token')
    }
    return response.data
  }
  async getMe() {
    console.log(VueCookies.get('token'))
    let response = await http.get('/auth/me', {
      'headers': {
        'Authorization': `Bearer ${VueCookies.get('token')}`
      }
    })
    console.log(response)
    return response.data
  }
  async deleteUser(data) {
    console.log(VueCookies.get('token'))
    let response = await http.delete(`/auth/me/${data.id}`, {
      'headers': {
        'Authorization': `Bearer ${VueCookies.get('token')}`
      }
    })
    console.log(response)
    return response.data
  }
  async updateDetails(data) {
    console.log(VueCookies.get('token'))
    let response = await http.put('/auth/updatedetails', data, {
      'headers': {
        'Authorization': `Bearer ${VueCookies.get('token')}`
      }
    })
    console.log(response)
    return response.data
  }

  async updatePassword(data) {
    console.log(VueCookies.get('token'))
    let response = await http.put('/auth/updatepassword', data, {
      'headers': {
        'Authorization': `Bearer ${VueCookies.get('token')}`
      }
    })
    console.log(response)
    return response.data
  }
}

export default new AuthService()
