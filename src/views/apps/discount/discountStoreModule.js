import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCoupons(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/discount-dashboard/coupons/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              coupon =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (coupon.code.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCoupon(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/discount-dashboard/coupons/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addCoupon(ctx, couponData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/discount-dashboard/coupons/', couponData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteCoupon(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/discount-dashboard/coupons/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchCampaigns(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/discount-dashboard/campaigns/', {})
          .then(response => {
            const { data } = response
            // const queryLowered = q.toLowerCase()

            // const filteredData = data.filter(
            //   coupon =>
            //     /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
            //     ()
            // )

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCampaign(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/discount-dashboard/campaigns/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addCampaign(ctx, couponData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/discount-dashboard/campaigns/', couponData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteCampaign(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/discount-dashboard/campaigns/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
