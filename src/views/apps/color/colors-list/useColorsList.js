import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useColorsList() {
  // Use toast
  const toast = useToast()

  const refColorListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'code', sortable: true },
    { key: 'color', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalColors = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refColorListTable.value ? refColorListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalColors.value,
    }
  })

  const refetchData = () => {
    refColorListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchColors = (ctx, callback) => {
    store
      .dispatch('app-color/fetchColors', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalColors.value = total
      })
      .catch((e) => {
        console.log(e);
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching colors list',
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

  return {
    fetchColors,
    tableColumns,
    perPage,
    currentPage,
    totalColors,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refColorListTable,
    resolveTrueFalseVariant,
    refetchData,
  }
}
