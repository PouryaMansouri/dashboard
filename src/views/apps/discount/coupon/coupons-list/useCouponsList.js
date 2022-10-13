import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCouponsList() {
  // Use toast
  const toast = useToast()

  const refCouponListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'code', sortable: true },
    { key: 'status', sortable: true },
    { key: 'total_discount', sortable: true },
    { key: 'usage_count', sortable: true },
    // { key: 'minimum_cart_amount', sortable: true },
    { key: 'discount_rate_or_fix_amount', label:'Discount Rate', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalCoupons = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refCouponListTable.value ? refCouponListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCoupons.value,
    }
  })

  const refetchData = () => {
    refCouponListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCoupons = (ctx, callback) => {
    store
      .dispatch('app-discount/fetchCoupons', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalCoupons.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching coupons list',
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
    if (status === "Active") return 'success'
    return 'danger'
  }

  return {
    fetchCoupons,
    tableColumns,
    perPage,
    currentPage,
    totalCoupons,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCouponListTable,
    resolveTrueFalseVariant,
    refetchData,
  }
}
