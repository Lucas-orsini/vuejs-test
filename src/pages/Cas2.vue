<template>
  <div id="app">
    <div class="header">
      <a href="/">
        <img src="http://via.placeholder.com/1000" class="logo" />
      </a>
      <div class="navigation">
        <a href="/citoyens">Citoyens</a>
        <a href="/entrepreneurs">Entrepreneurs</a>
        <a href="/organisations">Organisations</a>
      </div>
    </div>
    <div class="main">
      <h2 class="title">Dis nous en plus sur toi...</h2>
      <form>
        <div class="field">
          <span class="label">Prénom</span>
          <input type="text" />
        </div>
        <div class="field">
          <span class="label">Email</span>
          <input type="text" />
        </div>
        <div class="field">
          <span class="label">Age</span>
          <input type="text" />
        </div>
        <button class="submit">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/50/Yes_Check_Circle.svg"
          />
        </button>
      </form>
    </div>
    <div class="footer">
      <div>
        Made by <a href="https://makesense.org" target="_blank">makesense</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.logo {
  max-width: 50px;
  border-radius: 100px;
}
.header,
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navigation a {
  margin-left: 5px;
}
.main {
  margin-top: 40px;
}
.field {
  margin-bottom: 10px;
}
.label {
  margin-right: 5px;
}
</style>