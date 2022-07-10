import Vue from 'vue'

// axios
import axios from 'axios'

const accessToken = localStorage.getItem('accessToken')

const axiosIns = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

Vue.prototype.$http = axiosIns

export default axiosIns
