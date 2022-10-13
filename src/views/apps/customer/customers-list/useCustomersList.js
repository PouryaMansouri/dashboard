import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useCustomersList() {
  // Use toast
  const toast = useToast()

  const refCustomerListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'first_name', sortable: true },
    { key: 'last_name', sortable: true },
    { key: 'email', sortable: true },
    { key: 'phone_number', sortable: true }
  ]
  const perPage = ref(10)
  const totalCustomers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refCustomerListTable.value ? refCustomerListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCustomers.value,
    }
  })

  const refetchData = () => {
    refCustomerListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCustomers = (ctx, callback) => {
    store
      .dispatch('app-customer/fetchCustomers', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalCustomers.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching customers list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadExcelTable = () => {
    downloadExcel('refCustomerListTable', 'customer')
  }

  const printTable = () => {
    print('refCustomerListTable', 'customer')
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveCustomerIsActiveStaffVariant = status => {
    if (status === true) return 'success'
    return 'danger'
  }

  return {
    fetchCustomers,
    tableColumns,
    perPage,
    currentPage,
    totalCustomers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCustomerListTable,

    resolveCustomerIsActiveStaffVariant,
    refetchData,

    downloadExcelTable,
    printTable,
  }
}
