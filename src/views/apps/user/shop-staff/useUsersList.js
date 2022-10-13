import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { downloadExcel, print } from '@/@core/utils/utils'

export default function useUsersList(shopId) {
  // Use toast
  const toast = useToast()

  const refUserListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'first_name', sortable: true },
    { key: 'last_name', sortable: true },
    { key: 'email', sortable: true },
    { key: 'phone_number', sortable: true },
    { key: 'unique_code_five_digit', sortable: true },
    { key: 'update_date', sortable: true },
    { key: 'role', sortable: true },
  ]
  const perPage = ref(5)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const isActiveFilter = ref(null)
  const isStaffFilter = ref(true)
  const roleFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    }
  })

  const refetchData = () => {
    refUserListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, isActiveFilter, isStaffFilter, roleFilter], () => {
    refetchData()
  })

  const fetchUsers = (ctx, callback) => {
    store
      .dispatch('app-user/fetchShopStaff', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        isActive: isActiveFilter.value,
        isStaff: isStaffFilter.value,
        role: roleFilter.value,
        id:shopId
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalUsers.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching users list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadExcelTable = () => {
    downloadExcel('refUserListTable', 'shop-staff')
  }

  const printTable = () => {
    print('refUserListTable', 'shop-staff')
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserIsActiveStaffVariant = status => {
    if (status === true) return 'success'
    return 'danger'
  }

  return {
    fetchUsers,
    tableColumns,
    perPage,
    currentPage,
    totalUsers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,

    resolveUserIsActiveStaffVariant,
    refetchData,

    // Extra Filters
    isActiveFilter,
    isStaffFilter,
    roleFilter,
    downloadExcelTable,
    printTable,
  }
}
