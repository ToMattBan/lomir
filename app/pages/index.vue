<template>
  <div class="home-container">
    <h1 class="">{{ name }}</h1>

    <div class="typewriter-container">
      <div v-show="displayText">
        <span class="typewriter-text">{{ displayText }}</span>
        <span class="cursor">|</span>
      </div>

      <div class="_1/1">
        <input v-model="userName" placeholder="Seu nome aqui" v-show="inputToshow === 'name'">
        <input v-model="userRace" placeholder="Sua raça aqui" v-show="inputToshow === 'race'">
        <textarea v-model="userBackstory" placeholder="De onde veio, o que já fez, etc..." v-show="inputToshow === 'backstory'" />
      </div>

      <div class="start-buttons">
        <FantasyButton v-if="buttonToShow === 'start'" @click="startTyping">Começar Aventura</FantasyButton>
        <FantasyButton v-if="buttonToShow === 'startForm'" @click="formHandle">SIM!</FantasyButton>
        <FantasyButton v-if="buttonToShow === 'continue'" @click="formHandle">Pronto!</FantasyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FantasyButton from '~/components/FantasyButton.vue';

  type TStartButtons = 'none' | 'start' | 'startForm' | 'continue';
  type TStartInputs = 'none' | 'name' | 'race' | 'backstory';
  type TSentences = 'initial' | 'questionName' | 'questionRace' | 'questionBackstory';

  onMounted(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigateTo('/home');
    }
  });

  const userName = ref<string>('');
  const userRace = ref<string>('');
  const userBackstory = ref<string>('');

  const name = 'Valeroth';
  const allSentences = {
    initial: [
      `Bem-vindo à ${ name }!`,
      // 'Você acha que é capaz de sobreviver a esse mundo do qual você não sabe NADA??',
      // 'Vamos ver se você continuará tão valentão até o final da campanha! MUAHAHAHAHA',
      // '...',
      // '...',
      // 'Mas espera, eu nem sei quem você é...',
      'Tá na hora de mudar isso, não acha?',
    ],
    questionName: ['Ok, vamos começar do começo.', 'Qual é o seu nome?'],
    questionRace: [`Ah, então esse é o seu nome.`, 'Mas o quê você é? Qual sua raça?'],
    questionBackstory: [
      `Oh, faz tempo que não via um desses.`,
      'Tendo uma raça tão diferente, deve ter uma boa história por trás, não é?',
      'Então vai, me conta sua história',
    ],
  };
  const speeds = {
    type: 60,
    delete: 30,
    wait: 200,
  };

  const sentencesVariants = ref<TSentences>('initial');

  const sentencesToShow = ref<string[]>(allSentences[sentencesVariants.value]);
  const buttonToShow = ref<TStartButtons>('start');
  const inputToshow = ref<TStartInputs>('none');
  const displayText = ref<string>('');
  const currentSentenceIndex = ref<number>(0);
  const isDeleting = ref<boolean>(false);
  const solvePromisse = ref();

  function startDelete() {
    const totalChars = displayText.value.length;

    if (totalChars > 0) {
      displayText.value = displayText.value.substring(0, displayText.value.length - 1);
      setTimeout(() => {
        startDelete();
      }, speeds.delete);
    } else {
      isDeleting.value = false;
      currentSentenceIndex.value++;

      if (solvePromisse.value) {
        solvePromisse.value();
      }
    }
  }

  async function type() {
    const currentSentence = sentencesToShow.value[currentSentenceIndex.value];
    let speed = isDeleting.value ? speeds.delete : speeds.type;

    if (currentSentence) {
      const nextChar = currentSentence[displayText.value.length];

      if (nextChar) {
        displayText.value += nextChar;
      } else {
        speed = speeds.wait;
        isDeleting.value = currentSentenceIndex.value < sentencesToShow.value.length - 1;

        if (!isDeleting.value) {
          currentSentenceIndex.value++;
        }
      }
    }

    if (isDeleting.value) {
      await new Promise((resolve) => {
        startDelete();
        solvePromisse.value = resolve;
      });
    }

    if (currentSentence || isDeleting.value) {
      setTimeout(() => {
        type();
      }, speed);

      return;
    }

    // Finish writting everything
    if (sentencesVariants.value === 'initial') {
      buttonToShow.value = 'startForm';
    } else if (sentencesVariants.value === 'questionName') {
      buttonToShow.value = 'continue';
      inputToshow.value = 'name';
    } else if (sentencesVariants.value === 'questionRace') {
      buttonToShow.value = 'continue';
      inputToshow.value = 'race';
    } else if (sentencesVariants.value === 'questionBackstory') {
      buttonToShow.value = 'continue';
      inputToshow.value = 'backstory';
    }
  }

  function startTyping() {
    currentSentenceIndex.value = 0;
    buttonToShow.value = 'none';
    type();
  }

  async function formHandle() {
    buttonToShow.value = 'none';
    inputToshow.value = 'none';

    await new Promise((resolve) => {
      startDelete();
      solvePromisse.value = resolve;
    });

    if (sentencesVariants.value === 'initial') {
      sentencesToShow.value = allSentences.questionName;
      sentencesVariants.value = 'questionName';
    } else if (sentencesVariants.value === 'questionName') {
      sentencesToShow.value = allSentences.questionRace;
      sentencesVariants.value = 'questionRace';
    } else if (sentencesVariants.value === 'questionRace') {
      sentencesToShow.value = allSentences.questionBackstory;
      sentencesVariants.value = 'questionBackstory';
    } else if (sentencesVariants.value === 'questionBackstory') {
      // lalala
    }

    startTyping();
  }

</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);

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
