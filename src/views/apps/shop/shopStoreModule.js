import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchShops(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/shops-dashboard/shops/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              shop =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (shop.name.toLowerCase().includes(queryLowered) ||
                  shop.description.toLowerCase().includes(queryLowered) ||
                  shop.address.toLowerCase().includes(queryLowered)) ||
                shop.phone.toLowerCase().includes(queryLowered) ||
                shop.email.toLowerCase().includes(queryLowered),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchTransfersAll(ctx, queryParams) {
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
          .get(`/shops-dashboard/shops/${id}/transfer/`, {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              item => item.product.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchTransfersPending(ctx, queryParams) {
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
          .get(`/shops-dashboard/shops/${id}/pending-transfers/`, {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              item => item.product.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchTransfersBuy(ctx, queryParams) {
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
          .get(`/shops-dashboard/shops/${id}/buy/`, {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              item => item.product.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchOptionShops(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .get('/shops-dashboard/shops/', {})
          .then(response => {
            const { data } = response

            const active = data.filter(item => (item.status === 1));

            const filteredData = active.map(item => {
              return {
                value: item.id,
                text: item.name
              }
            })
            resolve({ data: filteredData })
          })
          .catch(error => reject(error))
      })
    },
    fetchShopsOption(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .get('/shops-dashboard/shops/', {})
          .then(response => {
            const { data } = response

            const active = data.filter(item => (item.status === 1));

            const filteredData = active.map(item => {
              return {
                value: item.id,
                label: item.name
              }
            })
            resolve({ data: filteredData })
          })
          .catch(error => reject(error))
      })
    },
    fetchShop(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/shops-dashboard/shops/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addShop(ctx, shopData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/shops-dashboard/shops/create/', shopData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editShop(ctx, { id, shopData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/shops-dashboard/shops/${id}/update/`, shopData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteShop(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/shops-dashboard/shops/${id}/delete/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
