const system: any = {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    component: null,
    children: [
        {
            path: '/rule',
            name: 'rule',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Rule.vue')
        },
        {
            path: '/role',
            name: 'role',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Role.vue')
        },
        {
            path: '/user',
            name: 'user',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/User.vue')
        },
        {
            path: '/dictionary',
            name: 'dictionary',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Dictionary.vue')
        },
        {
            path: '/unit',
            name: 'unit',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/system/Unit.vue')
        },
    ],
};

export default system;
