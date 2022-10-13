import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useBrandsList() {
  // Use toast
  const toast = useToast()

  const refBrandListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'slug', sortable: true },
    { key: 'description', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalBrands = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)
  const isActiveFilter = ref(null)
  const isDeletedFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refBrandListTable.value ? refBrandListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalBrands.value,
    }
  })

  const refetchData = () => {
    refBrandListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, isActiveFilter, isDeletedFilter], () => {
    refetchData()
  })

  const fetchBrands = (ctx, callback) => {
    store
      .dispatch('app-brand/fetchBrands', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        isActive: isActiveFilter.value,
        isDeleted: isDeletedFilter.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalBrands.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching brands list',
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
    downloadExcel('refBrandListTable', 'brands')
  }

  const printTable = () => {
    print('refBrandListTable', 'brands')
  }

  return {
    fetchBrands,
    tableColumns,
    perPage,
    currentPage,
    totalBrands,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refBrandListTable,
    resolveTrueFalseVariant,
    refetchData,
    // Extra Filters
    isActiveFilter,
    isDeletedFilter,
    downloadExcelTable,
    printTable,
  }
}
