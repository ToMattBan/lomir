<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import storeInit from './stores/index';

  onBeforeMount(() => {
    storeInit();
  });
</script>

<style lang="scss">
// Global styles

@import url('../node_modules/my-itcss/public/main.min.css');
html,body {
  background-color: black;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
  max-width: 600px;
  min-height: calc(100vh - 2rem);
  margin: auto;
  padding: 1rem;

  background-color: #f2f2f2;
}
</style>
