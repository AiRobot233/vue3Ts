const system: any = {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    component: null,
    children: [
        {
            path: '/system/rule',
            name: 'system/rule',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Rule.vue')
        },
        {
            path: '/system/role',
            name: 'system/role',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Role.vue')
        },
        {
            path: '/system/user',
            name: 'system/user',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/User.vue')
        },
        {
            path: '/system/dictionary',
            name: 'system/dictionary',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Dictionary.vue')
        },
        {
            path: '/system/unit',
            name: 'system/unit',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Unit.vue')
        },
        {
            path: '/system/setting',
            name: 'system/setting',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Setting.vue')
        },
    ],
};

export default system;
