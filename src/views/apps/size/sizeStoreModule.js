import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSizes(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/products/sizes/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              size =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (size.name.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchSize(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/products/sizes/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addSize(ctx, sizeData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/products/sizes/', sizeData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editSize(ctx, { id, sizeData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/products/sizes/${id}/`, sizeData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteSize(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/products/sizes/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
