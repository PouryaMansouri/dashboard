import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCommentsPending(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/comments/all-pending-comment')
          .then(response => {
            const { data } = response

            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCommentsAll(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/comments/all-comments/')
          .then(response => {
            const { data } = response
            const sortedData = data.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: data.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCommentsProduct(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        id = 0,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get(`/comments/all-comments/`)
          .then(response => {
            const { data } = response

            const filteredData = data.filter(item => item.object_id == id)

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    approveComment(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/comments/edit-detail-delete/${id}/`, { status: 2 })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    rejectComment(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/comments/edit-detail-delete/${id}/`, { status: 3 })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteComment(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/comments/edit-detail-delete/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
