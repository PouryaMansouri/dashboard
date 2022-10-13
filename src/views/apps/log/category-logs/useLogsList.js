import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { print, downloadExcel } from '@/@core/utils/utils'

export default function useLogsList(categoryId) {
  // Use toast
  const toast = useToast()

  const refCategoryLogsTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'full_name', sortable: true },
    { key: 'user.phone_number', label: "phone", sortable: true },
    { key: 'message', sortable: true },
    { key: 'action', sortable: true },
    { key: 'object_type', sortable: true },
    { key: 'object_id', sortable: true },
    { key: 'created_at', label: "time", sortable: true },
  ]
  const perPage = ref(10)
  const totalLogs = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refCategoryLogsTable.value ? refCategoryLogsTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalLogs.value,
    }
  })

  const refetchData = () => {
    refCategoryLogsTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCategoryLogs = (ctx, callback) => {
    store
      .dispatch('app-log/fetchCategoryLogs', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        id: categoryId
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalLogs.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching logs list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const downloadExcelTable = () => {
    downloadExcel('refCategoryLogsTable', 'category-logs')
  }

  const printTable = () => {
    print('refCategoryLogsTable', 'category-logs')
  }

  return {
    fetchCategoryLogs,
    tableColumns,
    perPage,
    currentPage,
    totalLogs,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCategoryLogsTable,
    refetchData,
    downloadExcelTable,
    printTable
  }
}
