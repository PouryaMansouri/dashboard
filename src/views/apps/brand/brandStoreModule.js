import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchBrands(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        isActive = null,
        isDeleted = null
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/brands/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              brand =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (brand.name.toLowerCase().includes(queryLowered) ||
                  brand.slug.toLowerCase().includes(queryLowered) ||
                  brand.description.toLowerCase().includes(queryLowered)) &&
                (isActive === null ? true : brand.is_active === isActive) &&
                (isDeleted === null ? true : brand.is_deleted === isDeleted),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchBrand(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/brands/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addBrand(ctx, brandData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/brands/', brandData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editBrand(ctx, { id, brandData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/brands/${id}/`, brandData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteBrand(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/brands/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
