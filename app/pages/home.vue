<template>
  <div>
  </div>
</template>

<script setup lang="ts">
  // Imports
  import type { IUsersFileInfo } from '~/interfaces/userInfo';
  import usersFileInfoData from '../stores/usersFileInfo.json';
  import { updateUser } from '@/utils/usersFile';

  // Page specific, stasrt of life-hook, etc
  onMounted(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigateTo('/');
    }
  });

  // Refs
  const usersFileInfo = reactive<IUsersFileInfo>(usersFileInfoData);

  // Functions
  async function testDb() {
    const user = {
      name: 'John Cena',
      race: 'Brawler',
      image: '',
      backstory: 'Its sad, soooo sad',
    };

    const newSha = await updateUser(usersFileInfo.sha, user);
    usersFileInfo.sha = newSha;
  }

  async function getUsers() {
    if (usersFileInfo.refreshInfo) {
      await usersFileInfo.refreshInfo();
    }
  }
</script>

<style lang="scss" scoped>
button {
  width: 100%;
  aspect-ratio: 3/1;
  font-size: 3rem;
  border-radius: 15px;
}
</style>
