import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchColors(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/products/colors/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              color =>
              /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
              (color.name.toLowerCase().includes(queryLowered) ||
                color.code.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchColor(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/products/colors/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addColor(ctx, colorData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/products/colors/', colorData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editColor(ctx, { id, colorData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/products/colors/${id}/`, colorData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteColor(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/products/colors/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
