const business: any = {
    path: '/business',
    name: 'business',
    icon: 'SettingOutlined',
    component: null,
    children: [
        {
            path: '/business/home',
            name: 'business/home',
            icon: 'UnorderedListOutlined',
            component: () => import('@/views/HomeView.vue')
        },
    ]
};

export default business;
