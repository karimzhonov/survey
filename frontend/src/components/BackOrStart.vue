<template>
  <div class="row justify-content-between align-items-center p-">
    <div class="col-12 col-lg p-0">
      <i @click="back" class="pi pi-arrow-circle-left m-1" style="font-size: 1.6rem; line-height: 1.5rem;"></i>
      <i @click="() => $router.push(home_to)" class="pi pi-home m-2" style="font-size: 1.6rem; line-height: 1.5rem;"></i>
    </div>
    <h1 v-if="header" class="m-0 p-0 col-12 col-lg-6 text-center" >
      {{ header }}
    </h1>
    <Button class="m-0 col-12 col-lg-3" 
    v-if="!$route.path.startsWith('/frame') && windowWidth > 998" 
    :label="$t('Перейти на главную страницу')" @click="() => $router.push({name: 'home'})"/>
    <div v-if="$route.path.startsWith('/frame')" class="m-0 col-12 col-lg-3"></div>
  </div>
</template>

<script>
export default {
  name: "BackOrStart",
  props: ['header', 'navigator', 'home_to'],
  data() {
    return {
      home: {icon: 'pi pi-home', to: this.home_to},
    }
  },
  computed: {
    windowWidth: () => window.innerWidth
  },
  methods: {
    back(){
      window.history.back()
    }
  }
}
</script>

<style>
.p-breadcrumb {
  background-color: inherit!important;
  border: 0;
}
</style>