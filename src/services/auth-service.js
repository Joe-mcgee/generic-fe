import http from "@/services/http-common.js"

class AuthService {
  async register(data) {
    let response = await http.post('/auth/register', data)
    console.log(response)
    return response.data
  }
  async login(data) {
    let response = await http.post('/auth/login', data)
    console.log(response)
    return response.data
  }
  async logout() {
    let response = await http.get('/auth/logout')
    console.log(response)
    return response.data
  }
}

export default new AuthService()
