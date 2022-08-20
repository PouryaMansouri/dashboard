/*

NOTE: tag is not supported in horizontal menu

Array of object

Top level object can be:
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- nav Grp (top level grp is called header group) ---/

title
icon (if it's on top/second level)
children

/--- nav Item (top level item is called header link) ---/

icon (if it's on top/second level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)

*/
import dashboard from '../dashboard'
import pages from '../pages'
import others from '../others'
import product from '../product'
import stock from '../stock'
import discount from '../discount'

// Array of sections
export default [{
    header: 'Dashboards',
    icon: 'HomeIcon',
    children: [
        ...dashboard,
    ],
},
{
    header: 'Pages',
    icon: 'FileTextIcon',
    children: [
        ...pages
    ],
},
{
    header: 'Discount',
    icon: 'FileTextIcon',
    children: [
        ...discount
    ],
},
{
    header: 'Product',
    icon: 'FileTextIcon',
    children: [
        ...product
    ],
},
{
    header: 'Stock',
    icon: 'FileTextIcon',
    children: [
        ...stock
    ],
},
{
    header: 'Others',
    icon: 'MoreHorizontalIcon',
    children: [
        ...others
    ],
},]
