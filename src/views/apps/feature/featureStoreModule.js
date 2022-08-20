import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchFeatures(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/products/features/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              feature =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (feature.description.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchFeature(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/products/features/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addFeature(ctx, featureData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/products/features/', featureData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editFeature(ctx, { id, featureData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/products/features/${id}/`, featureData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteFeature(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/products/features/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
