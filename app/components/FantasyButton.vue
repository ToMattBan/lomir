<template>
  <button :class="['fantasy-btn', variant]"><slot /></button>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ variant?: 'wood' | 'magical' | 'elven' | 'dragon'; }>(), { variant: 'wood' });
</script>

<style lang="scss" scoped>
.fantasy-btn {
  /* Base styling */
  padding: 12px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Cinzel', 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff5e1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  /* Border with engraved effect */
  border: 3px solid #5d2906;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px rgba(255, 215, 0, 0.4), inset -2px -2px 5px rgba(139, 69, 19, 0.6), 0 6px 12px rgba(0, 0, 0, 0.8);

  /* Positioning and cursor */
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  /* Add some texture */
  background-image: linear-gradient(30deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%), linear-gradient(-30deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%);
  background-size: 10px 10px;

  /* Background with metallic gradient */
  background: linear-gradient(145deg, #9c5c2a 0%, #b5651d 25%, #de9a4d 50%, #e67e22 75%, #9c5c2a 100%);

  &:active {
    transform: translateY(1px);
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(139, 69, 19, 0.8), 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  /* Add a fantasy emblem or symbol */
  &::after,
  &::before {
    content: '✦';
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
    color: #ffd700;
    text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
  }

  &::after {
    left: unset;
    right: 10px;
  }

  /* VARIATIONS */
  &.magical {
    background: linear-gradient(145deg, #4b0082 0%, #6a0dad 25%, #9370db 50%, #8a2be2 75%, #4b0082 100%);
    border-color: #2c0352;
    color: #e6e6fa;
    text-shadow: 0 0 10px #9370db;

    &:hover {
      background: linear-gradient(145deg, #5a1a9a 0%, #7b3dbd 25%, #a78be0 50%, #9b4de8 75%, #5a1a9a 100%);
      box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.3), inset -2px -2px 5px rgba(75, 0, 130, 0.6), 0 6px 12px rgba(75, 0, 130, 0.5);
    }
  }

  &.elven {
    background: linear-gradient(145deg, #2e8b57 0%, #3cb371 25%, #66cdaa 50%, #228b22 75%, #2e8b57 100%);
    border-color: #1c5c3a;
    color: #f0fff0;

    &::before {
      content: '❦';
      color: #98fb98;
    }
  }

  &.dragon {
    background: linear-gradient(145deg, #8b0000 0%, #b22222 25%, #dc143c 50%, #ff4500 75%, #8b0000 100%);
    border-color: #5a0000;
    color: #ffd700;

    &::before {
      content: '⚔';
      color: #ffa500;
    }
  }
}
</style>
