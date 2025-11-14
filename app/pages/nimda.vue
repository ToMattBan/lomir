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
      <div class="notification" :class="`notification__${notificationType}`" v-show="notification">
        <div class="close-notification" @click="notification = ''">X</div>
        <span>{{ notification }}</span>
      </div>

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
          <FantasyButton class="_fz14" @click="toggleEqpm(user)">Mostrar Equipamentos</FantasyButton>
          <FantasyButton class="_fz14" @click="updateAttributes(user)">Salvar Dados</FantasyButton>
        </div>

        <div class="user-eqpm" :class="{'open': userEqpmOpen === user.name}">
          <div class="user-eqpm__gold">
            <span>Ouro</span>
            <input v-model="user.equipment.gold">
          </div>

          <div class="user-eqpm__weapon">
            <span>Arma</span>
            <input v-model="user.equipment.weapon">
          </div>

          <div class="user-eqpm__armor">
            <span>Vestimenta</span>
            <input v-model="user.equipment.armor">
          </div>

          <div class="user-eqpm__other">
            <span>Outros</span>
            <ul>
              <li :key="index" v-for="eqpm, index in user.equipment.other">
                <input v-model="user.equipment.other[index]">
                <div class="removeEqpm" @click="removeEqpm(user, index)">-</div>
              </li>
              <li class="newEqpm" @click="addEqpm(user)">New Equipment</li>
            </ul>
          </div>
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

  const notification = ref<string>('');
  const notificationType = ref<'success' | 'error'>('success');

  async function updateAttributes(user: IUser) {
    try {
      await updateUser(usersFileInfo.sha, user);

      notificationType.value = 'success';
      notification.value = 'User updated, please ask the User to refresh their info!';
      if (usersFileInfo.refreshInfo) {
        usersFileInfo.refreshInfo();
      }
    } catch (e) {
      notificationType.value = 'error';
      notification.value = `Couldn't update User --> ${ e }`;
    }
  }

  const userEqpmOpen = ref<string | null>(null);

  function toggleEqpm(user: IUser) {
    if (userEqpmOpen.value === user.name) {
      userEqpmOpen.value = null;
    } else {
      userEqpmOpen.value = user.name;
    }
  }
  function addEqpm(user: IUser) {
    user.equipment.other.push('');
  }
  function removeEqpm(user: IUser, index: number) {
    user.equipment.other.splice(index, 1);
  }
</script>

<style lang="scss" scoped>
#nimda {
  font-size: 1.3rem;
  position: relative;

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

  .notification {
    color: white;
    padding: 1rem;
    padding-right: 1.5rem;
    border-radius: 10px;
    position: absolute;
    width: 100%;
    box-sizing: border-box;

    &__success {
      background-color: #2e8b57;
    }

    &__error {
      background-color: #8b0000;
    }

    .close-notification {
      position: absolute;
      cursor: pointer;
      right: 0.5rem;
      top: 0.5rem;
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
      z-index: 1;
    }

    .user-infos {
      flex: 2;
      max-width: calc((100% / 3) * 2);
      margin: auto;
      z-index: 1;

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
      z-index: 1;

      button {
        flex: 1;
      }
    }

    .user-eqpm {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: -100%;
      opacity: 0;
      transition: all 0.4s ease-out;

      &.open {
        opacity: 1;
        margin-top: 0%;
      }

      .user-eqpm__gold,
      .user-eqpm__weapon,
      .user-eqpm__armor,
      .user-eqpm__other {
        border-radius: 8px;
        flex: 1;
        min-width: 33%;
        border: solid 3px black;
        padding: 0.5rem 1rem;

        span {
          letter-spacing: 2px;
        }

        input {
          text-align: center;
          color: black;
          background: rgba(255, 255, 255, 0.23);
        }
      }

      .user-eqpm__gold {
        background-color: #d6c31593;

        &, input {
          border-color: #a99a10;
        }
      }

      .user-eqpm__weapon {
        background-color: #7f988793;

        &, input {
          border-color: #7f9887;
        }
      }

      .user-eqpm__armor {
        background-color: #12379093;

        &, input {
          border-color: #123790;
        }
      }

      .user-eqpm__other {
        width: 100%;
        flex: unset;
        background-color: #7a470593;

        &, input {
          border-color: #7a4705;
        }

        ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          li{
            margin-left: 1rem;
            display: flex;
            gap: 12px;

            &.newEqpm,
            .removeEqpm {
              border-radius: 10px;
              padding: 4px 16px;
              cursor: pointer;
              width: fit-content;
            }

            &.newEqpm{
              margin-left: 1rem;
              background-color: #68aa85;
              border: solid 3px #0a3e21;
            }

            input {
              text-align: left;
              width: 100%;

              &~div {
                width: 3rem;
                text-align: center;
                background-color: rgb(161, 92, 92);
                border: solid 3px rgb(73, 18, 18);
                color: white;
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
