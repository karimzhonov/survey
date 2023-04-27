export default [{
    path: "/:lang/passport",
    component: () => import("@/apps/passport/views/Layout.vue"),
    children: 
    [
        {
            path: '/:lang/passport',
            name: 'passport_main',
            component: () => import('@/apps/passport/views/Main.vue')
        },
        {
            path: '/:lang/passport/region/:region_id',
            name: 'passport_region_data',
            component: () => import('@/apps/passport/views/RegionData.vue'),
            props: true
        },
    ]
}]
