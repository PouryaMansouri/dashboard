import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCustomersOrders(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/customers/orders/')
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.user_has_order.filter(
              customersOrder =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                customersOrder.email.toLowerCase().includes(queryLowered) ||
                customersOrder.phone_number.toLowerCase().includes(queryLowered) ||
                customersOrder.last_name.toLowerCase().includes(queryLowered) ||
                customersOrder.first_name.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCustomersCarts(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/customers/carts/')
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.users_with_cart.filter(
              customersCart =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                customersCart.email.toLowerCase().includes(queryLowered) ||
                customersCart.phone_number.toLowerCase().includes(queryLowered) ||
                customersCart.last_name.toLowerCase().includes(queryLowered) ||
                customersCart.first_name.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCustomers(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          // .get('/dashboard/users/', { params: queryParams })
          .get('/dashboard/users/')
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              user =>
              /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
              (
                user.first_name.toLowerCase().includes(queryLowered) ||
                user.last_name.toLowerCase().includes(queryLowered) ||
                user.phone_number.includes(queryLowered) ||
                user.email.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/users/detail/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchOrdersOfCustomer(ctx, queryParams) {
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
          .get(`/customers/orders/customer-order-list/${id}/`)
          .then(response => {
            const { data } = response

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCartsOfCustomer(ctx, queryParams) {
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
          .get(`/customers/carts/customer-cart-item-list/${id}/`)
          .then(response => {
            const { data } = response

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/users/create/', userData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editUser(ctx, { id, userData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/dashboard/users/detail/${id}/`, userData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
