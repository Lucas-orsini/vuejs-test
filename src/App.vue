<template>
  <div id="app">
    <header id="header">
      <router-link to="/">Cas 1</router-link>
      <router-link to="/cas-2">Cas 2</router-link>
      <router-link to="/cas-3">Cas 3</router-link>
    </header>
    <router-view />
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss">
@import "@makesenseorg/design-system/dist/shared.scss";
#header {
  background: #efefef;
  display: flex;
  justify-content: space-around;
}
#app {
  min-height: 100%;
}

#header a {
  padding: 0 10px;
}

a.router-link-exact-active {
  font-weight: bold;
  background: $color-primary;
  color: $color-neutral-100;
  padding: 0 10px;
}
</style>
