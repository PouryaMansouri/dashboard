import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useShopProduct(shopId) {
  // Use toast
  const toast = useToast()

  const refShopProductTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'image' },
    { key: 'name', sortable: true },
    { key: 'slug', sortable: true },
    { key: 'status', sortable: true },
    { key: 'min_price', sortable: true },
    { key: 'product_type', sortable: true },
    { key: 'star', sortable: true },
  ]
  const perPage = ref(5)
  const totalShopProducts = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refShopProductTable.value ? refShopProductTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalShopProducts.value,
    }
  })

  const refetchData = () => {
    refShopProductTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchShopProducts = (ctx, callback) => {
    store
      .dispatch('app-product/fetchShopProducts', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        id: shopId
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalShopProducts.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching shopProducts',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveShopProductRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveShopProductRoleIcon = role => {
    if (role === 'subscriber') return 'ShopProductIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'ShopProductIcon'
  }

  const resolveShopProductStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchShopProducts,
    tableColumns,
    perPage,
    currentPage,
    totalShopProducts,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refShopProductTable,

    resolveShopProductRoleVariant,
    resolveShopProductRoleIcon,
    resolveShopProductStatusVariant,
    refetchData,

  }
}
