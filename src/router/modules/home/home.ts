const home: any = {
    path: '/business',
    name: 'business',
    icon: 'HomeOutlined',
    component: null,
    children: [
        {
            path: '/home',
            name: 'business/home',
            icon: 'HomeOutlined',
            component: () => import('@/views/HomeView.vue')
        },
    ]
};

export default home;
