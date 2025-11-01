<template>
  <div class="home-container">
    <h1 class="">{{ name }}</h1>

    <div class="typewriter-container" v-if="!userChar">
      <div>
        <span class="typewriter-text">Qual o nome do seu personagem?</span>
        <span class="cursor">|</span>
      </div>

      <div class="inputs-container _1/1">
        <input
          v-model="userName" placeholder="Sua personagem aqui"
          @input="clearError"
        >

        <div class="validation-error" v-show="validationError">{{ validationError }}</div>
      </div>

      <div class="start-buttons">
        <FantasyButton @click="checkCharacter">Checar!</FantasyButton>
      </div>
    </div>

    <div v-else>
      Bem-vindo {{ userChar.name }}
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
      checkCharacter();
    }
  });
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 2rem);

  h1 {
    text-align: center;
    font-size: 48px;
    text-transform: uppercase;
    margin-bottom: 0;
  }

  > div {
    margin: auto;
  }

  .typewriter-container {
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

    .cursor {
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  }
}
</style>
