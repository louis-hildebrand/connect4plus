<template>
  <div class="header-content">
    <div class="app-name"><strong>Quarto</strong></div>
    <slot></slot>
  </div>
</template>

<style scoped>
.header-content {
  background: darkslategrey;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-content: center;
  color: white;
  margin-bottom: 15px;
  max-height: 60px;
}

.app-name {
  font-size: xx-large;
  margin: 5px auto 5px 10px;
}
</style>
