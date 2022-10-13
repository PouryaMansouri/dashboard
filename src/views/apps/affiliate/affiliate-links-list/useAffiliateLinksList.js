import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useAffiliateLinksList() {
  // Use toast
  const toast = useToast()

  const refAffiliateLinksListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'user', sortable: true },
    { key: 'link', sortable: true },
    { key: 'count_clicks', sortable: true },
    { key: 'count_sales', sortable: true },
    { key: 'calculate_commission', sortable: true },
    { key: 'created_at', sortable: true },
  ]
  const perPage = ref(5)
  const totalAffiliateLinks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refAffiliateLinksListTable.value ? refAffiliateLinksListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalAffiliateLinks.value,
    }
  })

  const refetchData = () => {
    refAffiliateLinksListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchAffiliateLinksList = (ctx, callback) => {
    store
      .dispatch('app-affiliate/fetchAffiliateLinksList', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalAffiliateLinks.value = total
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
  
  const resolveStatusVariant = status => {
    if (status === 0) return 'PENDING'
    if (status === 1) return 'PROCESSING'
    if (status === 2) return 'DELIVERED'
    return 'CANCELED'
  }

  const downloadExcelTable = () => {
    downloadExcel('refAffiliateLinksListTable', 'affiliate-links')
  }

  const printTable = () => {
    print('refAffiliateLinksListTable', 'affiliate-links')
  }
  
  return {
    fetchAffiliateLinksList,
    tableColumns,
    perPage,
    currentPage,
    totalAffiliateLinks,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refAffiliateLinksListTable,
    resolveStatusVariant,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
