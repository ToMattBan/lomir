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

@font-face {
  font-family: 'MayaRegular';
  src: url('./assets/fonts/MayaRegular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

html,body {
  background-color: black;
  margin: 0;
  padding: 0;
  font-family: 'MayaRegular';
}

.app {
  max-width: 600px;
  overflow: hidden;
  min-height: calc(100vh - 2rem);
  margin: auto;
  padding: 1rem;

  background-color: #f2f2f2;
}

input, textarea {
  padding: 12px 16px;
  font-size: 1.1rem;
  font-family: 'Cinzel', 'Times New Roman', serif;
  color: #9b6a09;
  letter-spacing: 1px;
  width: 100%;
  box-sizing: border-box;

  /* Background with parchment-like texture */
  background: linear-gradient(145deg, #fdf5e6 0%, #faf0e6 50%, #fffaf0 100%);
  background-image:  radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.6) 0%, transparent 20%);

  /* Border with engraved effect */
  border: 3px solid #8b4513;
  border-radius: 8px;
  box-shadow:  inset 2px 2px 8px rgba(139, 69, 19, 0.3), inset -2px -2px 8px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);

  /* Text styling */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  outline: none;
  transition: all 0.3s ease;

  /* Placeholder styling */
  &::placeholder {
    color: #a0522d;
    font-style: italic;
    text-shadow: none;
    opacity: 0.8;
  }
}
</style>
