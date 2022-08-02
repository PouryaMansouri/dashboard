import axios from '@axios'
import { paginateArray, sortCompare } from '@/@core/utils/utils'

export default {
  namespaced: true,
  state: {
    cartItemsCount: (() => {
      const userData = JSON.parse(localStorage.getItem('userData'))
      return userData && userData.extras ? userData.extras.eCommerceCartItemsCount : 0
    })(),
  },
  getters: {},
  mutations: {
    UPDATE_CART_ITEMS_COUNT(state, count) {
      state.cartItemsCount = count
    },
  },
  actions: {
    fetchProducts(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/products/', {})
          .then(response => {
            // eslint-disable-next-line object-curly-newline
            const { q = '', sortBy = 'featured', perPage = 9, page = 1 } = payload

            const queryLowered = q.toLowerCase()

            const { data } = response;

            const filteredData = data.filter(product => product.name.toLowerCase().includes(queryLowered))

            let sortDesc = false
            const sortByKey = (() => {
              if (sortBy === 'price-desc') {
                sortDesc = true
                return 'price'
              }
              if (sortBy === 'price-asc') {
                return 'price'
              }
              sortDesc = true
              return 'id'
            })()

            const sortedData = filteredData.sort(sortCompare(sortByKey))
            if (sortDesc) sortedData.reverse()

            const paginatedData = JSON.parse(JSON.stringify(paginateArray(sortedData, perPage, page)))

            resolve(paginatedData)
          })
          .catch(error => reject(error))
      })
    },
    fetchProduct(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/dashboard/products/${productId}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchWishlistProducts() {
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/wishlist')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchCartProducts() {
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/cart')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // ------------------------------------------------
    // Product Actions
    // ------------------------------------------------
    addProductInWishlist(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/wishlist', { productId })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeProductFromWishlist(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/wishlist/${productId}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    addProductInCart(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/dashboard/cart', { productId })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeProductFromCart(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/dashboard/cart/${productId}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
