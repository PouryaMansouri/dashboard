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
        shops = null
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
                (stock.product.name.toLowerCase().includes(queryLowered) &&
                (shops === null ? true : stock.shop.id === shops)
                )
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchShopStocks(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        id = 0
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get(`/shops-dashboard/shops/${id}/stocks/`)
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
          .get(`/stocks-dashboard/stocks/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchStockPricing(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/pricing/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addStock(ctx, stockData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/stocks-dashboard/transfer-products/create/', stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addDiscount(ctx, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/pricing/discount/create/', data)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addPrice(ctx, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/pricing/price/create/', data)
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
    fetchStocksOnline(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/stocks_online/list/', {})
          .then(response => {
            const { data } = response

            const serializedData = data.map(
              item => {
                return {
                  id: item.id,
                  product_name: item.stock.product.name,
                  stock_price: item.stock.price,
                  stock_quantity: item.stock.price,
                  stock_status: item.stock.status,
                  color: item.stock.color.name,
                  size: item.stock.size.name,
                  transfer_type: item.transfer_type,
                  status: item.status,
                  quantity: item.quantity
                }
              }
            )

            const queryLowered = q.toLowerCase()

            const filteredData = serializedData.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (stock.product_name.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchStocksOnlineShop(ctx, { shopId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/stocks_online/list/${shopId}/all/`)
          .then(response => {
            const { data } = response

            const filteredData = data.map(
              stock => {
                return {}
              }
            )
            resolve({ filteredData })
          })
          .catch(error => reject(error))
      })
    },
    fetchStockOnline(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/stocks_online/detail/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addStockOnline(ctx, stockData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/stocks_online/create/', stockData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    completeStockOnline(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/stocks_online/complete/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteStockOnline(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/stocks_online/delete/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
