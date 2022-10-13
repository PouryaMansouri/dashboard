import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useCustomersOrdersList() {
  // Use toast
  const toast = useToast()

  const refCustomersOrderListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'email', sortable: true },
    { key: 'phone_number', sortable: true },
    { key: 'last_login', sortable: true },
    { key: 'order_count', sortable: true },
    { key: 'complete_order', sortable: true },
    { key: 'pending_order', sortable: true },
    { key: 'cancel_order', sortable: true },
    { key: 'total_price_buy', sortable: true },
    { key: 'total_discount_buy', sortable: true },
    { key: 'final_pay', sortable: true },
  ]

  const perPage = ref(10)
  const totalCustomersOrders = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refCustomersOrderListTable.value ? refCustomersOrderListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCustomersOrders.value,
    }
  })

  const refetchData = () => {
    refCustomersOrderListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCustomersOrders = (ctx, callback) => {
    store
      .dispatch('app-customer/fetchCustomersOrders', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalCustomersOrders.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching customersOrders list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadExcelTable = () => {
    downloadExcel('refCustomersOrderListTable', 'customers-orders')
  }

  const printTable = () => {
    print('refCustomersOrderListTable', 'customers-orders')
  }


  return {
    fetchCustomersOrders,
    tableColumns,
    perPage,
    currentPage,
    totalCustomersOrders,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCustomersOrderListTable,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
