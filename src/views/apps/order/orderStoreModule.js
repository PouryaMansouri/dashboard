import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrderListPending(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/orders-dashboard/order-delivery/')
          .then(response => {
            const { data } = response

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchShopSells(ctx, queryParams) {
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
          .get(`/shops-dashboard/shops/${id}/sell/`)
          .then(response => {
            const { data } = response
            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchOrders(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        status = null,
        orderType = null
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/orders-dashboard/list-orders/', {})
          .then(response => {
            const { data } = response

            const filteredData = data.filter(
              order =>
              /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
              (
                (status === null ? true : order.status === status) &&
                (orderType === null ? true : order.order_type === orderType)
              )
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    changeStatusOrder(ctx, { id, status }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/orders-dashboard/order-delivery/${id}/`, { delivery_status: status })
          .then(response => { 
            resolve(response) 
          })
          .catch(error => reject(error))
      })
    },
    deleteOrder(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/orders-dashboard/order-detail/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
