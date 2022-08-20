import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        isActive = null,
        isStaff = null
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          // .get('/dashboard/users/', { params: queryParams })
          .get('/dashboard/users/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              user =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (user.first_name.toLowerCase().includes(queryLowered) ||
                  user.last_name.toLowerCase().includes(queryLowered) ||
                  user.email.toLowerCase().includes(queryLowered)) &&
                (isActive === null ? true : user.is_active === isActive) &&
                (isStaff === null ? true : user.is_staff === isStaff),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchUsersOption(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/users/', {})
          .then(response => {
            const { data } = response

            const filteredData = data.filter(
              user =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (user.is_active && user.is_staff)
            )

            const users = filteredData.map((user) => {
              return {
                text: `${user.first_name} ${user.last_name}`,
                value: user.id,
              };
            });

            resolve(users)
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
    fetchSelf(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/accounts/profile/detail/`)
          .then(response => resolve(response))
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
