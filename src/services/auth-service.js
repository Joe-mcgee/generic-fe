import http from "@/services/http-common.js"
import VueCookies from 'vue-cookies'
class AuthService {
  async oAuthLogin(provider) {
    //google
    //facebook
    let response
    try {
      response = await http.get(`/auth/${provider}`)
    } catch (e) {
      return e.response.data
    }
    return response.data
  }

  async register(data) {
    let response;
    try {
      response = await http.post('/auth/register', data)
    } catch (e) {
      return e.response.data
    }
    return response.data
  }

  async login(data) {
    let response;
    try {
      response = await http.post('/auth/login', data)
    } catch (e) {
      return e.response.data
    }
    if (response.data.success == true) {
      console.log('cookie set')
      VueCookies.set('token', response.data.token, "1h")
    }
    return response.data
  }
  async resendEmail(data) {
    let response
    try {
      response = await http.post('/auth/resendconfirmemail', data)
    } catch (e) {
      return e.response.data
    }
    return response.data
  }
  async forgotPassword(data) {
    let response;
    try {
      response = await http.post('/auth/forgotpassword/', data)
    } catch (e) {
      return e.response.data
    }
    return response.data
  }
  async resetPassword(data) {
    let response;
    try {
      response = await http.put(`/auth/resetpassword/${data.resettoken}`, data)
    } catch (e) {
      return e.response.data
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
    let response;
    try {
      response = await http.put('/auth/updatedetails', data, {
        'headers': {
          'Authorization': `Bearer ${VueCookies.get('token')}`
        }
      })
    } catch (e) {
      return e.response.data
    }
    return response.data
  }

  async updatePassword(data) {
    let response;
    try {
      response = await http.put('/auth/updatepassword', data, {
        'headers': {
          'Authorization': `Bearer ${VueCookies.get('token')}`
        }
      })
    } catch (e) {
      return e.response.data
    }
    return response.data
  }
}

export default new AuthService()
