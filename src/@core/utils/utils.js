import router from '@/router'
// eslint-disable-next-line object-curly-newline
import { reactive, getCurrentInstance, watch, toRefs } from '@vue/composition-api'

export const isObject = obj => typeof obj === 'object' && obj !== null

export const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const paginateArray = (array, perPage, page) => array.slice((page - 1) * perPage, page * perPage)

export const sortCompare = key => (a, b) => {
  const fieldA = a[key]
  const fieldB = b[key]

  let comparison = 0
  if (fieldA > fieldB) {
    comparison = 1
  } else if (fieldA < fieldB) {
    comparison = -1
  }
  return comparison
}

export const onlyInLeft = (left, right) =>
  left.filter(
    ({ value: id1 }) => !right.some(({ value: id2 }) => id2 === id1)
  );
  
  export const hasInLeft = (left, right) =>
  left.filter(
    ({ value: id1 }) => right.some(({ value: id2 }) => id2 === id1)
  );

const getRandomFromArray = array => array[Math.floor(Math.random() * array.length)]

// ? Light and Dark variant is not included
// prettier-ignore
export const getRandomBsVariant = () => getRandomFromArray(['primary', 'secondary', 'success', 'warning', 'danger', 'info'])

export const isDynamicRouteActive = route => {
  const { route: resolvedRoute } = router.resolve(route)
  return resolvedRoute.path === router.currentRoute.path
}

// Thanks: https://medium.com/better-programming/reactive-vue-routes-with-the-composition-api-18c1abd878d1
export const useRouter = () => {
  const vm = getCurrentInstance().proxy
  const state = reactive({
    route: vm.$route,
  })

  watch(
    () => vm.$route,
    r => {
      state.route = r
    },
  )

  return { ...toRefs(state), router: vm.$router }
}

/**
 * This is just enhancement over Object.extend [Gives deep extend]
 * @param {target} a Object which contains values to be overridden
 * @param {source} b Object which contains values to override
 */
// export const objectExtend = (a, b) => {
//   // Don't touch 'null' or 'undefined' objects.
//   if (a == null || b == null) {
//     return a
//   }

//   Object.keys(b).forEach(key => {
//     if (Object.prototype.toString.call(b[key]) === '[object Object]') {
//       if (Object.prototype.toString.call(a[key]) !== '[object Object]') {
//         // eslint-disable-next-line no-param-reassign
//         a[key] = b[key]
//       } else {
//         // eslint-disable-next-line no-param-reassign
//         a[key] = objectExtend(a[key], b[key])
//       }
//     } else {
//       // eslint-disable-next-line no-param-reassign
//       a[key] = b[key]
//     }
//   })

//   return a
// }
