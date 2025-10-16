<template>
  <div class="home-container">
    <h1 class="">{{ name }}</h1>

    <div class="_fz30 _tac" v-if="existingUser">
      Parece que você já criou um personagem. Agora é só esperar S2
    </div>

    <div class="typewriter-container" v-else>
      <div v-show="displayText">
        <span class="typewriter-text">{{ displayText }}</span>
        <span class="cursor">|</span>
      </div>

      <div class="inputs-container _1/1">
        <input
          v-model="userName" placeholder="Seu nome aqui" v-show="inputToshow === 'name'"
          @input="clearError"
        >
        <input
          v-model="userRace" placeholder="Sua raça aqui" v-show="inputToshow === 'race'"
          @input="clearError"
        >

        <div v-show="inputToshow === 'image'">
          <img :src="userImage">
          <input type="file" @change="newImage" @input="clearError">
        </div>

        <textarea
          v-model="userBackstory" placeholder="De onde veio, o que já fez, etc..." v-show="inputToshow === 'backstory'"
          @input="clearError"
        />

        <div class="validation-error" v-show="validationError">{{ validationError }}</div>
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
  import type { IUsersFileInfo, IUser } from '~/interfaces/userInfo';
  import usersFileInfoData from '../stores/usersFileInfo.json';

  type TStartButtons = 'none' | 'start' | 'startForm' | 'continue';
  type TStartInputs = 'none' | 'name' | 'race' | 'image' | 'backstory';
  type TSentences = 'initial' | 'questionName' | 'questionRace' | 'questionImage' | 'questionBackstory' | 'finish';

  const existingUser = ref<boolean>(false);
  onMounted(() => {
    const user = localStorage.getItem('user');
    if (user) {
      existingUser.value = true;
      // navigateTo('/home');
    }
  });

  const userName = ref<string>('');
  const userRace = ref<string>('');
  const userImage = ref<string>('');
  const userBackstory = ref<string>('');
  const usersFileInfo = reactive<IUsersFileInfo>(usersFileInfoData);

  async function saveUser() {
    const user: IUser = {
      name: userName.value,
      race: userRace.value,
      backstory: userBackstory.value,
      image: userImage.value,
    };

    localStorage.setItem('user', JSON.stringify(user));

    await updateUser(usersFileInfo.sha, user);
  }

  function newImage(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        // Create canvas with the same dimensions as the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Set canvas size to image size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image onto canvas
        ctx.drawImage(image, 0, 0);

        // Convert to WebP with quality setting (0.8 = 80% quality)
        const webpBase64 = canvas.toDataURL('image/webp', 0.8);
        userImage.value = webpBase64;

        // Optional: Log size comparison
        console.log('Original size:', file.size, 'bytes');
        console.log('WebP size (~approx):', Math.round((webpBase64.length - 'data:image/webp;base64,'.length) * 0.75), 'bytes');
      };

      image.src = event.target?.result as string;
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }

  const name = 'Valeroth';
  const allSentences = {
    initial: [
      `Bem-vindo à ${ name }!`,
      'Você acha que é capaz de sobreviver a esse mundo do qual você não sabe NADA??',
      'Vamos ver se você continuará tão valentão até o final da campanha! MUAHAHAHAHA',
      '...',
      '...',
      'Mas espera, eu nem sei quem você é...',
      'Tá na hora de mudar isso, não acha?',
    ],
    questionName: [
      'Ok, vamos começar do começo.',
      'Qual é o seu nome?',
    ],
    questionRace: [
      `Ah, então é assim que você se chama.`,
      'Mas o quê você é? Qual sua raça?',
    ],
    questionImage: [
      'Oh, faz tempo que não via um desses.',
      'E pra falar a verdade eu não estou vendo muito bem, perdi meus óculos, sabe...',
      'Poderia me mostrar como tu está agora?',
    ],
    questionBackstory: [
      'Tendo uma raça tão diferente, deve ter uma boa história por trás, não é?',
      'Então vai, me conta sua história',
    ],
    finish: ['Muito obrigado, agora podemos começar... MUAHAHAHAHAH'],
  };
  const speeds = {
    type: 60,
    delete: 20,
    wait: 2000,
  };

  const sentencesVariants = ref<TSentences>('initial');

  const sentencesToShow = ref<string[]>(allSentences[sentencesVariants.value]);
  const buttonToShow = ref<TStartButtons>('start');
  const inputToshow = ref<TStartInputs>('none');
  const displayText = ref<string>('');
  const currentSentenceIndex = ref<number>(0);
  const isDeleting = ref<boolean>(false);
  const solvePromisse = ref();
  const validationError = ref<string>('');

  function clearError() {
    validationError.value = '';
  }

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
        setTimeout(() => {
          startDelete();
          solvePromisse.value = resolve;
        }, speed);
      });

      speed = speeds.type;
    }

    if (currentSentence && !isDeleting.value) {
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
    } else if (sentencesVariants.value === 'questionImage') {
      buttonToShow.value = 'continue';
      inputToshow.value = 'image';
    } else if (sentencesVariants.value === 'questionBackstory') {
      buttonToShow.value = 'continue';
      inputToshow.value = 'backstory';
    } else if (sentencesVariants.value === 'finish') {
      buttonToShow.value = 'none';
      inputToshow.value = 'none';
    }
  }

  function startTyping() {
    currentSentenceIndex.value = 0;
    buttonToShow.value = 'none';
    type();
  }

  async function formHandle() {
    if (sentencesVariants.value === 'questionName' && !userName.value) {
      validationError.value = 'Todo mundo tem um nome, não tente me enganar';
      return;
    } else if (sentencesVariants.value === 'questionRace' && !userRace.value) {
      validationError.value = 'Olha, alguma coisa tu é, de certeza';
      return;
    } else if (sentencesVariants.value === 'questionImage' && !userImage.value) {
      validationError.value = 'Vamos lá, quero ver como tu é, não se acanhe';
      return;
    } else if (sentencesVariants.value === 'questionBackstory' && !userBackstory.value) {
      validationError.value = 'Se tu chegou até aqui, um passado tu tem, me mostra vai';
      return;
    }

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
      sentencesToShow.value = allSentences.questionImage;
      sentencesVariants.value = 'questionImage';
    } else if (sentencesVariants.value === 'questionImage') {
      sentencesToShow.value = allSentences.questionBackstory;
      sentencesVariants.value = 'questionBackstory';
    } else if (sentencesVariants.value === 'questionBackstory') {
      sentencesToShow.value = allSentences.finish;
      sentencesVariants.value = 'finish';
      saveUser();
    }

    startTyping();
  }
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
