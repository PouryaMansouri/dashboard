import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useAffiliateAccountsList() {
  // Use toast
  const toast = useToast()

  const refAffiliateAccountsListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'user', sortable: true },
    { key: 'bank_account_number', sortable: true },
    { key: 'updated_at', sortable: true },
    { key: 'status', sortable: true },
    { key: 'transactions_req' },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalAffiliateAccounts = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refAffiliateAccountsListTable.value ? refAffiliateAccountsListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalAffiliateAccounts.value,
    }
  })

  const refetchData = () => {
    refAffiliateAccountsListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchAffiliateAccounts = (ctx, callback) => {
    store
      .dispatch('app-affiliate/fetchAffiliateAccounts', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalAffiliateAccounts.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching affiliateAccounts list',
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
    downloadExcel('refAffiliateAccountsListTable', 'affiliate-accounts')
  }

  const printTable = () => {
    print('refAffiliateAccountsListTable', 'affiliate-accounts')
  }

  return {
    fetchAffiliateAccounts,
    tableColumns,
    perPage,
    currentPage,
    totalAffiliateAccounts,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refAffiliateAccountsListTable,
    resolveTrueFalseVariant,
    refetchData,
    downloadExcelTable,
    printTable,
  }
}
