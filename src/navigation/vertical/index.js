import dashboard from '../dashboard'
import pages from '../pages'
import others from '../others'

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
    ...pages
    ,
    {
        header: 'Others',
    },
    ...others
]
