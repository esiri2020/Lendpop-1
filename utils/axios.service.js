import axios from './axios.setup';

class LendPopApi {
  login(data) {
    return axios.post("/login", data)
  }

  register(data) {
    return axios.post("/register", data)
  }

  otpGeneration(data) {
    return axios.post('/generate/otp', data)
  }

  verification(data) {
    return axios.post("/validate/otp", data)
  }

  password(data) {
    return axios.post("/password", data)
  }

  history(data) {
    return axios.post('/history', data)
  }

  kycUpdate(data) {
    return axios.post('/kyc/update', data)
  }

  loanApplication(data) {
    return axios.post('/apply', data)
  }

}

export default new LendPopApi();
