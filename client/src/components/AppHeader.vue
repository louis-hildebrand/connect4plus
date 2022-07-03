<template>
  <div class="header-content">
    <div class="app-name"><strong>Connect 4+</strong></div>
    <slot></slot>
  </div>
</template>

<style scoped>
.header-content {
  background: var(--color-dark-main, darkslategrey);
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-content: center;
  color: var(--color-font-light, white);
  margin-bottom: 15px;
  max-height: 60px;
}

.app-name {
  font-size: x-large;
  margin: 5px auto 5px 10px;
}
</style>
