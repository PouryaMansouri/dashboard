import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useSuppliersList() {
  // Use toast
  const toast = useToast()

  const refSupplierListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'supplier_type', sortable: true },
    { key: 'work_type', sortable: true },
    { key: 'is_active', sortable: true },
    { key: 'email', sortable: true },
    { key: 'show_details'},    
    { key: 'actions' },
  ]
  const perPage = ref(10)
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
      .dispatch('app-supplier/fetchSuppliers', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
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

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveTrueFalseVariant = item => {
    if (item === true) return 'success'
    return 'danger'
  }
  const resolveWorkType = item => {
    if (item === 1) return 'Provider'
    if (item === 2) return 'Buyer'
    if (item === 3) return 'Distributor'
    return 'Other'
  }
  const resolveSupplierType = item => {
    if (item === 1) return 'Company'
    if (item === 2) return 'Person'
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
    resolveTrueFalseVariant,
    resolveSupplierType,
    resolveWorkType,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
