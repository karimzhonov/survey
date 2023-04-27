export default [{
    path: "/:lang/map",
    component: () => import("@/apps/map/views/Layout"),
    props: true,
    children: 
    [
        {
            path: '/:lang/map',
            name: 'map_main',
            component: () => import('@/apps/map/views/Map.vue'),
            props: true
        },
    ]
}]
