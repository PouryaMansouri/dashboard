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
          .get('/stocks-dashboard/stocks/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (stock.product.name.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchStocksHistory(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/stocks-dashboard/transfer-products/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (stock.product.name.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchStocksPending(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/stocks-dashboard/transfer-products/pendding/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (stock.product.name.toLowerCase().includes(queryLowered))
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
          .get(`/stocks-dashboard/transfer-products/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addStock(ctx, stockData) {
      console.log(stockData);
      return new Promise((resolve, reject) => {
        axios
          .post('/stocks-dashboard/transfer-products/create/', stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    confirmTransfer(ctx, { id, stockData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/stocks-dashboard/transfer-products/${id}/confirm/`, stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    cancelTransfer(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/stocks-dashboard/transfer-products/${id}/cancel/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
