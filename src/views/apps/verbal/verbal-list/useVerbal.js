import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useVerbal(shopId) {
  // Use toast
  const toast = useToast()

  const refVerbalStockListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'image', sortable: true },
    { key: 'count' },
    { key: 'add' },
    { key: 'product', sortable: true },
    { key: 'price', sortable: true },
    { key: 'discount', sortable: true },
    { key: 'price_without_discount', sortable: true },
    { key: 'color', sortable: true },
    { key: 'size', sortable: true },
    { key: 'shop', sortable: true },
    { key: 'quantity', sortable: true },
  ]
  const perPage = ref(10)
  const totalVerbalStocks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refVerbalStockListTable.value ? refVerbalStockListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalVerbalStocks.value,
    }
  })

  const refetchData = () => {
    refVerbalStockListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchVerbalStocks = (ctx, callback) => {
    store
      .dispatch('app-verbal/fetchVerbalStocks', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        shopId: shopId
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalVerbalStocks.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching verbalStocks list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  return {
    fetchVerbalStocks,
    tableColumns,
    perPage,
    currentPage,
    totalVerbalStocks,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refVerbalStockListTable,

    refetchData,
  }
}
