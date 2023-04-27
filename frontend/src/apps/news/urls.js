export default [{
    path: "/:lang/news",
    component: () => import("@/apps/news/views/Layout.vue"),
    children: 
    [
        {
            path: '/:lang/news/list',
            name: 'news_main',
            component: () => import('@/apps/news/views/ListNews.vue')
        },
        {
            path: '/:lang/news/detail/:id',
            name: 'news_datail',
            component: () => import('@/apps/news/views/DetailNews.vue'),
            props: true
        },
    ]
}]