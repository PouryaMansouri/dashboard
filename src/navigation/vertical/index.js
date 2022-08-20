import dashboard from '../dashboard'
import pages from '../pages'
import others from '../others'
import product from '../product'
import stock from '../stock'
import discount from '../discount'

export default [
    {
        title: 'Dashboards',
        icon: 'HomeIcon',
        children: [
            ...dashboard
        ],
    },
    {
        header: 'Pages',
    },
    ...pages,
    {
        header: 'Discount',
    },
    ...discount
    ,
    {
        header: 'Product',
    },
    ...product
    ,
    {
        header: 'Stock',
    },
    ...stock
    ,
    {
        header: 'Others',
    },
    ...others
]
