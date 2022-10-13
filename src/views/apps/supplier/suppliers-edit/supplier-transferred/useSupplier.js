import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useSupplier(supplierId) {
  // Use toast
  const toast = useToast()

  const refSupplierListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'product__name', sortable: true },
    { key: 'transfer_products__id', sortable: true },
    { key: 'shop__name', sortable: true },
    { key: 'color__name', sortable: true },
    { key: 'size__name', sortable: true },
    { key: 'total_transferred', sortable: true },
    { key: 'total_purchase', sortable: true },
  ]
  const perPage = ref(5)
  const totalSuppliers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refSupplierListTable.value ? refSupplierListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSuppliers.value,
    }
  })

  const refetchData = () => {
    refSupplierListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchSuppliers = (ctx, callback) => {
    store
      .dispatch('app-supplier/fetchSupplierTransferred', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        id: supplierId
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalSuppliers.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching suppliers list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadExcelTable = () => {
    downloadExcel('refSupplierListTable', 'suppliers')
  }

  const printTable = () => {
    print('refSupplierListTable', 'suppliers')
  }

  return {
    fetchSuppliers,
    tableColumns,
    perPage,
    currentPage,
    totalSuppliers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSupplierListTable,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
