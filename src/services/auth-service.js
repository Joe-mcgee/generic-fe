import http from "@/services/http-common.js"
import VueCookies from 'vue-cookies'
class AuthService {
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
}

export default new AuthService()
