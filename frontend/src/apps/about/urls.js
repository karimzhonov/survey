export default [
    {
        path: '/:lang/about',
        name: 'about',
        component: () => import('@/apps/about/views/About.vue'),
        props: true
    },
]