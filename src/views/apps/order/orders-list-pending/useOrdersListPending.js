import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useOrdersListPending() {
  // Use toast
  const toast = useToast()

  const refOrderListPendingTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'order', label: "order_id", sortable: true },
    { key: 'stock.shop.name', label: "shop_name", sortable: true },
    { key: 'stock.product.name', label: "product", sortable: true },
    { key: 'stock.color.name', label: "color", sortable: true },
    { key: 'stock.size.name', label: "size", sortable: true },
    { key: 'quantity', sortable: true },
    { key: 'total_price', sortable: true },
    { key: 'total_discount', sortable: true },
    { key: 'final_price', sortable: true },
    { key: "delivery_status", label: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(5)
  const totalOrders = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refOrderListPendingTable.value ? refOrderListPendingTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalOrders.value,
    }
  })

  const refetchData = () => {
    refOrderListPendingTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchOrderListPending = (ctx, callback) => {
    store
      .dispatch('app-order/fetchOrderListPending', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalOrders.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching orders list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveStatusVariant = status => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'PROCESSING'
    if (status === 2) return 'DELIVERED'
    return 'CANCELED'
  }

  const downloadExcelTable = () => {
    downloadExcel('refOrderListPendingTable', 'delivery-pending')
  }

  const printTable = () => {
    print('refOrderListPendingTable', 'delivery-pending')
  }

  return {
    fetchOrderListPending,
    tableColumns,
    perPage,
    currentPage,
    totalOrders,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refOrderListPendingTable,
    resolveStatusVariant,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
