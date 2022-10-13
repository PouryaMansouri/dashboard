import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useStocksList() {
  // Use toast
  const toast = useToast()

  const refStockListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'product', sortable: true },
    { key: 'price', sortable: true },
    { key: 'color', sortable: true },
    { key: 'size', sortable: true },
    { key: 'shop', sortable: true },
    { key: 'quantity', sortable: true },
    { key: 'online_offline_status', label: "online/offline", sortable: true },
    { key: 'status', sortable: true },
  ]
  const perPage = ref(10)
  const totalStocks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const shopsFilter = ref(null)

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

  watch([currentPage, perPage, searchQuery,shopsFilter], () => {
    refetchData()
  })

  const fetchStocks = (ctx, callback) => {
    store
      .dispatch('app-stock/fetchStocks', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        shops: shopsFilter.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalStocks.value = total
      })
      .catch(() => { })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*
  const downloadExcelTable = () => {
    downloadExcel('refStockListTable', 'stocks')
  }

  const printTable = () => {
    print('refStockListTable', 'stocks')
  }

  return {
    fetchStocks,
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
    downloadExcelTable,
    printTable,
    shopsFilter,
    refetchData,
  }
}
