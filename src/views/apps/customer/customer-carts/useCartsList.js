import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useCartsList(customerId) {
  // Use toast
  const toast = useToast()

  const refOrderListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'shop', sortable: true },
    { key: 'count', sortable: true },
    { key: 'color', sortable: true },
    { key: 'size', sortable: true },
    { key: 'price', sortable: true },
    { key: 'updated_at', sortable: true },
    { key: 'status', sortable: true },
  ]
  const perPage = ref(10)
  const totalOrders = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const orderTypeFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refOrderListTable.value ? refOrderListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalOrders.value,
    }
  })

  const refetchData = () => {
    refOrderListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter, orderTypeFilter], () => {
    refetchData()
  })

  const fetchOrders = (ctx, callback) => {
    store
      .dispatch('app-customer/fetchCartsOfCustomer', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
        orderType: orderTypeFilter.value,
        id: customerId
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

  const resolveTrueFalseVariant = status => {
    if (status === true) return 'success'
    return 'danger'
  }

  const downloadExcelTable = () => {
    downloadExcel('refOrderListTable', 'CartsOfCustomer')
  }

  const printTable = () => {
    print('refOrderListTable', 'CartsOfCustomer')
  }

  return {
    fetchOrders,
    tableColumns,
    perPage,
    currentPage,
    totalOrders,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refOrderListTable,
    resolveTrueFalseVariant,
    refetchData,
    // Extra Filters
    statusFilter,
    orderTypeFilter,
    downloadExcelTable,
    printTable,
  }
}
