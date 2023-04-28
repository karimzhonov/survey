export default [{
    path: "/:lang/survey",
    component: () => import("@/apps/survey/views/Layout.vue"),
    children: 
    [
        {
            path: '/:lang/',
            name: 'survey_list',
            component: () => import('@/apps/survey/views/SurveyList.vue')
        },
        {
            path: '/:lang/detail/:id',
            name: 'survey_datail',
            component: () => import('@/apps/survey/views/SurveyDetail.vue'),
            props: true
        },
        {
            path: '/:lang/dashboard/:id',
            name: 'survey_dashboard',
            component: () => import('@/apps/survey/views/SurveyDashboard.vue'),
            props: true
        },
        {
            path: '/:lang/public/:id',
            name: 'survey_public',
            component: () => import('@/apps/survey/views/SurveyPublic.vue'),
            props: true
        },
    ]
}]