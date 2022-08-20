import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchFaqs(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/faqs/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              faq =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (faq.question.toLowerCase().includes(queryLowered) || faq.answer.toLowerCase().includes(queryLowered))
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchFaq(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/faqs/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addFaq(ctx, faqData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/faqs/', faqData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editFaq(ctx, { id, faqData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/faqs/${id}/`, faqData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteFaq(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/faqs/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
