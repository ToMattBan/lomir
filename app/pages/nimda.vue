<template>
  <div id="nimda">
    <div v-show="currentTab === 'lore'">LORE</div>
    <div id="chars_tab" v-show="currentTab === 'chars'">
      <div :key="key" v-for="(user, key) in usersFileInfo.content" class="char-card">
        <img :src="user.image">
        <div>
          <p class="_df _jcsa _fw7 _fz20">
            <span>{{ user.name }}</span>
            <span>{{ user.race }}</span>
          </p>
          <p>{{ user.backstory }}</p>
        </div>
      </div>
    </div>

    <ul class="tabs _bgwhite">
      <li
        :key="tab.id" v-for="tab in tabs"
        :class="{'tab-active': currentTab === tab.id}"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type {  IUsersFileInfo } from '~/interfaces/userInfo';
  import usersFileInfoData from '../stores/usersFileInfo.json';

  type TTabs = 'lore' | 'chars';

  const usersFileInfo = reactive<IUsersFileInfo>(usersFileInfoData);

  const tabs: { name: string; id: TTabs; }[] = [
    { name: 'Lore', id: 'lore' },
    { name: 'Chars', id: 'chars' },
  ];

  const currentTab = ref<TTabs>('chars');
</script>

<style lang="scss" scoped>
#nimda {
  font-size: 1.3rem;
}

.tabs {
  position: fixed;
  bottom: 0;
  padding: 0 1rem;
  margin: 0 -1rem;
  width: 100%;
  max-width: 600px;
  list-style: none;
  border-top: solid 2px black;
  display: flex;
  justify-content: space-around;
  height: 60px;

  li {
    flex: 1;
    text-align: center;
    cursor: pointer;
    margin: auto;

    &:first-child {
      border-right: solid 2px black;
    }

    &.tab-active {
      font-weight: 700;
      font-size: 1.3rem;
    }
  }
}

#chars_tab {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-height: calc(100vh - 60px - 2rem);
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .char-card {
    display: flex;
    width: 100%;
    gap: 1rem;

    img {
      max-width: calc(100% / 3);
      object-fit: cover;
    }

    div {
      max-width: calc((100% / 3) * 2);
      margin: auto;
    }
  }
}
</style>
