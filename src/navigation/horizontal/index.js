import dashboard from '../dashboard'
import affiliate from '../affiliate'
import userManagement from '../userManagement'
import branchManagement from '../branchManagement'
import providerManagement from '../providerManagement'
import productManagement from '../productManagement'
import salesManagement from '../salesManagement'
import systemManagement from '../systemManagement'

// Array of sections
export default [
    {
        header: 'Dashboard',
        icon: 'HomeIcon',
        children: [
            ...dashboard,
        ],
    },
    {
        header: 'Users',
        icon: 'FileTextIcon',
        children: [
            ...userManagement
        ],
    },
    {
        header: 'Branches',
        icon: 'FileTextIcon',
        children: [
            ...branchManagement
        ],
    },
    {
        header: 'Providers',
        icon: 'FileTextIcon',
        children: [
            ...providerManagement
        ],
    },
    {
        header: 'Product',
        icon: 'FileTextIcon',
        children: [
            ...productManagement
        ],
    },
    {
        header: 'Sales',
        icon: 'FileTextIcon',
        children: [
            ...salesManagement
        ],
    },
    {
        header: 'Affiliate',
        icon: 'FileTextIcon',
        children: [
            ...affiliate
        ],
    },
    {
        header: 'System',
        icon: 'FileTextIcon',
        children: [
            ...systemManagement
        ],
    }
]
