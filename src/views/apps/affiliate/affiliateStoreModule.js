import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchAffiliateAccounts(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/affiliate-dashboard/accounts/')
          .then(response => {
            const { data } = response

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchAffiliateLinksList(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/affiliate-dashboard/links/')
          .then(response => {
            const { data } = response
            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    changeStatusAffiliateAccounts(ctx, { id, status }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/affiliate-dashboard/accounts/${id}/`, { status })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    changeStatusAffiliateTrx(ctx, { id, status }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/affiliate-dashboard/transactions/${id}/`, { status })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
