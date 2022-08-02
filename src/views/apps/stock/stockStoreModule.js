import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchStocks(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/stocks/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (stock.name.toLowerCase().includes(queryLowered) ||
                  stock.description.toLowerCase().includes(queryLowered) ||
                  stock.address.toLowerCase().includes(queryLowered)) ||
                stock.phone.toLowerCase().includes(queryLowered) ||
                stock.email.toLowerCase().includes(queryLowered),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchStock(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/stocks/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addStock(ctx, stockData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/stocks/', stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editStock(ctx, { id, stockData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/stocks/${id}/`, stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
