import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useCategoriesList() {
  // Use toast
  const toast = useToast()

  const refCategoryListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'slug', sortable: true },
    { key: 'description', sortable: true },
    { key: 'is_active', sortable: true },
    { key: 'is_navbar', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalCategories = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)
  const isActiveFilter = ref(null)
  const isDeletedFilter = ref(null)
  const isNavbarFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refCategoryListTable.value ? refCategoryListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCategories.value,
    }
  })

  const refetchData = () => {
    refCategoryListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, isActiveFilter, isDeletedFilter, isNavbarFilter], () => {
    refetchData()
  })

  const fetchCategories = (ctx, callback) => {
    store
      .dispatch('app-category/fetchCategories', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        isActive: isActiveFilter.value,
        isDeleted: isDeletedFilter.value,
        isNavbar: isNavbarFilter.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalCategories.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching categories list',
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
    downloadExcel('refCategoryListTable', 'categories')
  }

  const printTable = () => {
    print('refCategoryListTable', 'categories')
  }

  return {
    fetchCategories,
    tableColumns,
    perPage,
    currentPage,
    totalCategories,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCategoryListTable,
    resolveTrueFalseVariant,
    refetchData,
    // Extra Filters
    isActiveFilter,
    isDeletedFilter,
    isNavbarFilter,
    downloadExcelTable,
    printTable,
  }
}
