import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useProductStocks(productId) {
  // Use toast
  const toast = useToast()

  const refStockListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'shop', sortable: true },
    { key: 'purchase_price', sortable: true },
    { key: 'total_transfer_price', sortable: true },
    { key: 'offline_stock'},
    { key: 'online_stock'},
  ]
  const perPage = ref(5)
  const totalProductStocks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('shop')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refStockListTable.value ? refStockListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalProductStocks.value,
    }
  })

  const refetchData = () => {
    refStockListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchProductStocks = (ctx, callback) => {
    store
      .dispatch('app-product/fetchProductStocks', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        productId: productId,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalProductStocks.value = total
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
    fetchProductStocks,
    tableColumns,
    perPage,
    currentPage,
    totalProductStocks,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refStockListTable,

    refetchData,
  }
}
