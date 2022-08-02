import store from '@/store'
import { useRouter } from '@core/utils/utils'

export const useEcommerce = () => {
  // eslint-disable-next-line arrow-body-style
  const addProductInWishlist = productId => {
    return store.dispatch('app-product/addProductInWishlist', { productId })
  }

  // eslint-disable-next-line arrow-body-style
  const removeProductFromWishlist = productId => {
    return store.dispatch('app-product/removeProductFromWishlist', { productId })
  }

  // eslint-disable-next-line arrow-body-style
  const addProductInCart = productId => {
    return store.dispatch('app-product/addProductInCart', { productId })
  }

  // eslint-disable-next-line arrow-body-style
  const removeProductFromCart = productId => {
    return store.dispatch('app-product/removeProductFromCart', { productId })
  }

  return {
    addProductInWishlist,
    removeProductFromWishlist,
    addProductInCart,
    removeProductFromCart,
  }
}

export const useEcommerceUi = () => {
  const { router } = useRouter()

  const toggleProductInWishlist = product => {
    const { addProductInWishlist, removeProductFromWishlist } = useEcommerce()
    if (product.isInWishlist) {
      removeProductFromWishlist(product.id).then(() => {
        // eslint-disable-next-line no-param-reassign
        product.isInWishlist = false
      })
    } else {
      addProductInWishlist(product.id).then(() => {
        // eslint-disable-next-line no-param-reassign
        product.isInWishlist = true
      })
    }
  }

  const handleCartActionClick = product => {
    const { addProductInCart } = useEcommerce()

    if (product.isInCart) {
      router.push({ name: 'apps-e-commerce-checkout' })
    } else {
      addProductInCart(product.id).then(() => {
        // eslint-disable-next-line no-param-reassign
        product.isInCart = true

        // Update cart items count
        store.commit('app-product/UPDATE_CART_ITEMS_COUNT', store.state['app-product'].cartItemsCount + 1)
      })
    }
  }

  const handleWishlistCartActionClick = (product, removeProductFromWishlistUi) => {
    const { addProductInCart, removeProductFromWishlist } = useEcommerce()

    if (product.isInCart) {
      router.push({ name: 'apps-e-commerce-checkout' })
    } else {
      addProductInCart(product.id)
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          product.isInCart = true
          removeProductFromWishlist(product.id)

          // Update cart items count
          store.commit('app-product/UPDATE_CART_ITEMS_COUNT', store.state['app-product'].cartItemsCount + 1)
        })
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          product.isInWishlist = false
          removeProductFromWishlistUi(product)
        })
    }
  }
  return {
    toggleProductInWishlist,
    handleCartActionClick,
    handleWishlistCartActionClick,
  }
}
