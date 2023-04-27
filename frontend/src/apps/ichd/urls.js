export default [{
    path: "/:lang/ichd",
    component: () => import("@/apps/ichd/views/ICHDLayout.vue"),
    children: 
    [
        {
            path: '/:lang/ichd',
            name: 'ichd_main',
            component: () => import('@/apps/ichd/views/Main.vue')
        },
        {
            path: '/:lang/ichd/sector/:sector_id/region/:region_id',
            name: 'ichd_sector_id_region_id',
            component: () => import('@/apps/ichd/views/SectorRegion.vue'),
            props: true
        },
    
        {
            path: '/:lang/ichd/sector/:sector_id/region/:region_id/criteria/:criteria_id',
            name: 'ichd_sector_id_region_id_criteria_id',
            component: () => import('@/apps/ichd/views/AreaTable.vue'),
            props: true
        },
    
        {
            path: '/:lang/ichd/data-table',
            name: 'ichd_data_table',
            component: () => import('@/apps/ichd/views/DataTable.vue')
        },
    
        {
            path: '/:lang/ichd/region',
            name: 'ichd_region',
            component: () => import('@/apps/ichd/views/RegionBar.vue')
        },
    
        {
            path: '/:lang/ichd/region-data',
            name: 'ichd_region-data-table',
            component: () => import('@/apps/ichd/views/RegionTable.vue')
        },

        {
            name: 'ichd_sector_region-data-table',
            path: "/:lang/ichd/region-sector-data",
            component: () => import("@/apps/ichd/views/SectorTable.vue")
        },

        {
            name: 'ichd_region_sector-data-table',
            path: "/:lang/ichd/sector-region-data",
            component: () => import("@/apps/ichd/views/SectorRegionTable.vue")
        },
    
        {
            path: '/:lang/ichd/area-data-table',
            name: 'ichd_area-data-table',
            component: () => import('@/apps/ichd/views/AreaDataTable.vue')
        },

        {
            path: '/:lang/ichd/area-criteria-data-table/:area_id',
            name: 'ichd_area-criteria-data-table',
            component: () => import('@/apps/ichd/views/AreaCriteriaDataTable.vue'),
            props: true,
        },
    
        {
            path: '/:lang/ichd/sector/:sector_id/region',
            name: 'sector_id_region',
            component: () => import('@/apps/ichd/views/Sector.vue'),
            props: true,
        },
        {
            path: '/:lang/ichd/sector/:sector_id/region/:region_id/area/:area_id',
            name: 'sector_id_region_id_area_id',
            component: () => import('@/apps/ichd/views/AreaInRegionInSector.vue'),
            props: true,
        },
        {
            path: '/:lang/ichd/sector/:sector_id/region/:region_id/area/:area_id/criteria/:criteria_id',
            name: 'sector_id_region_id_area_id_table_id',
            component: () => import('@/apps/ichd/views/TableAreaInRegionInSector.vue'),
            props: true,
        },
    
        {
            path: '/:lang/ichd/region/:region_id/sector',
            name: 'region_id_sector',
            component: () => import('@/apps/ichd/views/Region.vue'), 
            props: true
        },
        {
            path: '/:lang/ichd/region/:region_id/sector/:sector_id/area',
            name: 'region_id_sector_id',
            component: () => import('@/apps/ichd/views/SectorInRegion.vue'),
            props: true
        },
    ]
},
{
    path: '/:lang/ichd/uploader',
    name: 'ichd_uploader',
    component: () => import("@/apps/ichd/views/Uploader.vue"),
}]
