import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCommentsList(productId) {
  // Use toast
  const toast = useToast()

  const refCommentListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'user', sortable: true },
    { key: 'object_id', label: 'product id', sortable: true },
    { key: 'email', sortable: true },
    { key: 'rate', sortable: true },
    { key: 'body', sortable: true },
    { key: 'created_at', sortable: true },
    { key: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(5)
  const totalComments = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refCommentListTable.value ? refCommentListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalComments.value,
    }
  })

  const refetchData = () => {
    refCommentListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCommentsPending = (ctx, callback) => {
    store
      .dispatch('app-comment/fetchCommentsPending', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalComments.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching comments list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const fetchCommentsProduct = (ctx, callback) => {
    store
      .dispatch('app-comment/fetchCommentsProduct', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        id: productId,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalComments.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching comments list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const fetchCommentsAll = (ctx, callback) => {
    store
      .dispatch('app-comment/fetchCommentsAll', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalComments.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching comments list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveStatus = status => {
    if (status === 1) return 'Pending'
    if (status === 2) return 'Approve'
    if (status === 3) return 'Reject'
  }

  return {
    fetchCommentsProduct,
    fetchCommentsPending,
    fetchCommentsAll,
    tableColumns,
    perPage,
    currentPage,
    totalComments,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCommentListTable,
    resolveStatus,
    refetchData,
  }
}
