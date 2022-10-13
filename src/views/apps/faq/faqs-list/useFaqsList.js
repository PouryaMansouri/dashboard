import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useFaqsList() {
  // Use toast
  const toast = useToast()

  const refFaqListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'question', sortable: true },
    { key: 'answer', sortable: true },
    { key: 'is_active', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalFaqs = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refFaqListTable.value ? refFaqListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalFaqs.value,
    }
  })

  const refetchData = () => {
    refFaqListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchFaqs = (ctx, callback) => {
    store
      .dispatch('app-faq/fetchFaqs', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalFaqs.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching faqs list',
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
    fetchFaqs,
    tableColumns,
    perPage,
    currentPage,
    totalFaqs,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refFaqListTable,
    resolveTrueFalseVariant,
    refetchData,
  }
}
