const system: any = {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    component: null,
    children: [
        {
            path: '/rule',
            name: 'system/rule',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Rule.vue')
        },
        {
            path: '/role',
            name: 'system/role',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Role.vue')
        },
        {
            path: '/user',
            name: 'system/user',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/User.vue')
        },
        {
            path: '/dictionary',
            name: 'system/dictionary',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Dictionary.vue')
        },
        {
            path: '/unit',
            name: 'system/unit',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Unit.vue')
        },
        {
            path: '/setting',
            name: 'system/setting',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Setting.vue')
        },
    ],
};

export default system;
