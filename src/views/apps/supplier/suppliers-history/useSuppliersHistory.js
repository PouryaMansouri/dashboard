import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useSuppliersHistory(supplierId) {
  // Use toast
  const toast = useToast()

  const refStockListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'product', sortable: true },
    { key: 'color', sortable: true },
    { key: 'size', sortable: true },
    { key: 'transfer_to_shop', sortable: true },
    { key: 'quantity', sortable: true },
    { key: 'status', sortable: true },
    { key: 'transfer_type', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalStocks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refStockListTable.value ? refStockListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalStocks.value,
    }
  })

  const refetchData = () => {
    refStockListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchStocksHistory = (ctx, callback) => {
    store
      .dispatch('app-supplier/fetchStocksHistory', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        supplierId: supplierId,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalStocks.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching stocks list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  return {
    fetchStocksHistory,
    tableColumns,
    perPage,
    currentPage,
    totalStocks,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refStockListTable,

    refetchData,
  }
}
