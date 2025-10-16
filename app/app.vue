<template>
  <div>
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
