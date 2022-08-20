import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCategories(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        isActive = null,
        isDeleted = null,
        isNavbar = null,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/categories/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              category =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (category.name.toLowerCase().includes(queryLowered) ||
                  category.slug.toLowerCase().includes(queryLowered) ||
                  category.description.toLowerCase().includes(queryLowered)) &&
                (isActive === null ? true : category.is_active === isActive) &&
                (isDeleted === null ? true : category.is_deleted === isDeleted)&&
                (isNavbar === null ? true : category.is_navbar === isNavbar),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCategory(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/categories/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addCategory(ctx, categoryData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/categories/', categoryData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editCategory(ctx, { id, categoryData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/categories/${id}/`, categoryData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteCategory(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/categories/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
