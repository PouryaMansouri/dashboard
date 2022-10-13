import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useShopsList() {
  // Use toast
  const toast = useToast()

  const refShopListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'description', sortable: true },
    { key: 'address', sortable: true },
    { key: 'phone', sortable: true },
    { key: 'email', sortable: true },
    { key: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalShops = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refShopListTable.value ? refShopListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalShops.value,
    }
  })

  const refetchData = () => {
    refShopListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchShops = (ctx, callback) => {
    store
      .dispatch('app-shop/fetchShops', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalShops.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching shops list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*
  const resolveShopStatusVariant = status => {
    if (status === 'Deleted') return 'danger'
    if (status === 'Active') return 'success'
    return 'secondary'
  }

  const downloadExcelTable = () => {
    downloadExcel('refShopListTable', 'shops')
  }

  const printTable = () => {
    print('refShopListTable', 'shops')
  }

  return {
    fetchShops,
    tableColumns,
    perPage,
    currentPage,
    totalShops,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refShopListTable,

    refetchData,
    resolveShopStatusVariant,
    downloadExcelTable,
    printTable,
  }
}
