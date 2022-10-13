import dashboard from '../dashboard'
import affiliate from '../affiliate'
import userManagement from '../userManagement'
import branchManagement from '../branchManagement'
import providerManagement from '../providerManagement'
import productManagement from '../productManagement'
import salesManagement from '../salesManagement'
import systemManagement from '../systemManagement'

export default [
    {
        header: 'Dashboard',
    },
    ...dashboard
    ,
    {
        header: 'Users Management',
    },
    ...userManagement,
    {
        header: 'Branches Management',
    },
    ...branchManagement
    ,
    {
        header: 'Providers Management',
    },
    ...providerManagement
    ,
    {
        header: 'Product Management',
    },
    ...productManagement
    ,
    {
        header: 'Sales Management',
    },
    ...salesManagement
    ,
    {
        header: 'Affiliate',
    },
    ...affiliate,
    {
        header: 'System Management',
    },
    ...systemManagement
]
