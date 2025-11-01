<template>
  <div class="home-container">
    <h1 class="">{{ name }}</h1>

    <div class="typewriter-container" v-if="!userChar">
      <div>
        <span class="typewriter-text">Qual o nome do seu personagem?</span>
      </div>

      <div class="inputs-container _1/1">
        <input v-model="userName" placeholder="Sua personagem aqui" @input="clearError">

        <div class="validation-error" v-show="validationError">{{ validationError }}</div>
      </div>

      <div class="start-buttons">
        <FantasyButton @click="checkCharacter">Checar!</FantasyButton>
      </div>
    </div>

    <div v-else>
      <div class="char-card">
        <img :src="userChar.image">
        <div>
          <p class="_df _jcsa _fw7 _fz30">
            <span>{{ userChar.name }}</span>
            <span>{{ userChar.race }}</span>
          </p>
          <p>{{ userChar.backstory.replaceAll('\\n', '. ') }}</p>
        </div>
      </div>

      <div class="attr-card">
        <div>
          <span class="attr-name">Força</span>
          <span class="attr-number">{{ userChar.attributes.strength }}</span>
        </div>
        <div>
          <span class="attr-name">Agilidade</span>
          <span class="attr-number">{{ userChar.attributes.agility }}</span>
        </div>
        <div>
          <span class="attr-name">Resistência</span>
          <span class="attr-number">{{ userChar.attributes.resistency }}</span>
        </div>
        <div>
          <span class="attr-name">Foco</span>
          <span class="attr-number">{{ userChar.attributes.focus }}</span>
        </div>
      </div>

      <div class="eqpm-card">
        <div class="eqpm-gold">
          <span>Ouro</span>
          <div>{{ userChar.equipment.gold }}</div>
        </div>

        <div class="eqpm-weapon">
          <span>Arma</span>
          <div>{{ userChar.equipment.weapon }}</div>
        </div>

        <div class="eqpm-armor">
          <span>Vestimenta</span>
          <div>{{ userChar.equipment.armor }}</div>
        </div>

        <div class="eqpm-other">
          <span>Outros</span>
          <div :key="eqpm" v-for="eqpm in userChar.equipment.other">{{ eqpm }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FantasyButton from '~/components/FantasyButton.vue';
  import type { IUsersFileInfo, IUser } from '~/interfaces/storesInfo';
  import usersFileInfoData from '../stores/usersFileInfo.json';

  const name = 'Valeroth';

  const usersFileInfo = reactive<IUsersFileInfo>(usersFileInfoData);

  const userName = ref<string>('');
  const userChar = ref<IUser>();

  const validationError = ref<string>('');

  function clearError() {
    validationError.value = '';
  }

  async function checkCharacter() {
    const findUser = usersFileInfo.content[userName.value];

    if (findUser) {
      userChar.value = findUser;
    } else {
      validationError.value = 'Nenhum personagem com esse nome cadastrado!';
    }
  }

  onMounted(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userJson = JSON.parse(user);
      userName.value = userJson.name;
    }
  });
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 2rem);
  font-size: 1.3rem;

  h1 {
    text-align: center;
    font-size: 48px;
    text-transform: uppercase;
  }

  .typewriter-container {
    margin: auto;
    min-height: 60px;
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    text-align: center;
    width: 80%;

    .inputs-container {
      img {
        max-width: 100%;
      }

      .validation-error {
        color: red;
        font-size: 1.1rem;
        font-family: 'Cinzel', 'Times New Roman', serif;
        margin-top: 8px;
      }
    }
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

  .attr-card {
    display: flex;
    margin-top: 3rem;
    gap: 1rem;

    &>div {
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      padding: 1rem 0;
      border: 3px solid #5d2906;
      border-radius: 8px;
      color: #fff5e1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      letter-spacing: 2px;
      background-color: #8e4b1e;

      .attr-number {
        display: block;
        font-size: 2rem;
      }
    }
  }

  .eqpm-card {
    margin-top: 3rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .eqpm-gold,
    .eqpm-weapon,
    .eqpm-armor,
    .eqpm-other {
      border-radius: 8px;
      flex: 1;
      border: solid 3px black;
      padding: 0.5rem 1rem;

      span {
        letter-spacing: 2px;
      }

      div {
        text-align: center;
        font-size: 1.5rem;
      }
    }

    .eqpm-gold {
      border-color: #a99a10;
      background-color: #d6c31593;
    }

    .eqpm-weapon {
      border-color: #7f9887;
      background-color: #7f988793;
    }

    .eqpm-armor {
      border-color: #123790;
      background-color: #12379093;
    }

    .eqpm-other {
      width: 100%;
      flex: unset;
      border-color: #7a4705;
      background-color: #7a470593;

      div {
        text-align: left;
        margin-left: 3rem;
      }
    }
  }
}
</style>
