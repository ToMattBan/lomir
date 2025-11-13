<template>
  <div id="nimda">
    <div id="lore_tab" v-show="currentTab === 'lore'">
      <ul>
        <li :key="index" v-for="lore, index in campaignFileInfo.checklist">
          <fieldset>
            <input :id="index.toString()" type="checkbox" :name="index.toString()">
            <label :for="index.toString()">{{ lore }}</label>
          </fieldset>
        </li>
      </ul>
    </div>

    <div id="chars_tab" v-show="currentTab === 'chars'">
      <div :key="key" v-for="(user, key) in usersFileInfo.content" class="char-card">
        <img :src="user.image">
        <div class="user-infos">
          <p class="_df _jcsa _fw7 _fz20">
            <span>{{ user.name }}</span>
            <span>{{ user.race }}</span>
          </p>

          <p>{{ user.backstory }}</p>

          <div class="_df _jcsa">
            <div class="_df _fxdc _aic">
              <div>Força</div>
              <input v-model.number="user.attributes.strength" class="_tac" type="number">
            </div>

            <div class="_df _fxdc _aic">
              <div>Agilidade</div>
              <input v-model.number="user.attributes.agility" class="_tac" type="number">
            </div>

            <div class="_df _fxdc _aic">
              <div>Resistência</div>
              <input v-model.number="user.attributes.resistency" class="_tac" type="number">
            </div>

            <div class="_df _fxdc _aic">
              <div>Foco</div>
              <input v-model.number="user.attributes.focus" class="_tac" type="number">
            </div>
          </div>
        </div>

        <div class="user-buttons">
          <FantasyButton class="_fz14" @click="updateAttributes(user)">Trocar Atributos</FantasyButton>
          <FantasyButton class="_fz14">Trocar Equipamento</FantasyButton>
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
  import type { ICampaignFileInfo, IUser, IUsersFileInfo } from '~/interfaces/storesInfo';
  import usersFileInfoData from '../stores/usersFileInfo.json';
  import campaignFileInfoData from '../stores/campaignFileInfo.json';

  type TTabs = 'lore' | 'chars';

  const usersFileInfo = reactive<IUsersFileInfo>(usersFileInfoData);
  const campaignFileInfo = reactive<ICampaignFileInfo>(campaignFileInfoData);

  const tabs: { name: string; id: TTabs; }[] = [
    { name: 'Lore', id: 'lore' },
    { name: 'Chars', id: 'chars' },
  ];

  const currentTab = ref<TTabs>('chars');

  async function updateAttributes(user: IUser) {
    await updateUser(usersFileInfo.sha, user);
  }
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

#lore_tab,
#chars_tab {
  max-height: calc(100vh - 60px - 2rem);
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

#lore_tab {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li {
      input:checked ~ label {
        text-decoration-line: line-through;
      }
    }

  }
}

#chars_tab {
  display: flex;
  flex-direction: column;
  gap: 3rem;

  .char-card {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 1rem;

    img {
      flex: 1;
      max-width: calc(100% / 3);
      object-fit: cover;
    }

    .user-infos {
      flex: 2;
      max-width: calc((100% / 3) * 2);
      margin: auto;

      input {
        border: none;
        box-shadow: none;
        background: transparent;
        padding: 0;
        width: 1.5rem;
      }
    }

    .user-buttons {
      display: flex;
      width: 100%;
      gap: 1rem;

      button {
        flex: 1;
      }
    }
  }
}
</style>
