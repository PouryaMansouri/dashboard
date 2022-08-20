import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useFeaturesList() {
  // Use toast
  const toast = useToast()

  const refFeatureListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'description', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalFeatures = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refFeatureListTable.value ? refFeatureListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalFeatures.value,
    }
  })

  const refetchData = () => {
    refFeatureListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchFeatures = (ctx, callback) => {
    store
      .dispatch('app-feature/fetchFeatures', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalFeatures.value = total
      })
      .catch((e) => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching features list',
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
    fetchFeatures,
    tableColumns,
    perPage,
    currentPage,
    totalFeatures,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refFeatureListTable,
    resolveTrueFalseVariant,
    refetchData,
  }
}
