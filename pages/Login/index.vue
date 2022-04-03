<template>
  <b-container class="p-5 login-form">
    <form ref="form" @submit.prevent="login">
      <b-form-group
        label="Username"
        label-for="username-input"
        invalid-feedback="Username is required"
        :state="usernameState"
      >
        <b-form-input
          id="username-input"
          v-model="loginForm.username"
          :state="usernameState"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="info">Login</b-button>
    </form>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { userStore } from "~/store";

interface Data {
  usernameState: boolean | null;
  loginForm: {
    username: string;
  };
  redirectPage: string;
}

export default Vue.extend({
  data(): Data {
    return {
      usernameState: null,
      loginForm: {
        username: "",
      },
      redirectPage: "/",
    };
  },
  created() {
    const { page } = this.$route.query;
    if (page !== null) {
      this.redirectPage = page as string;
    }
  },
  methods: {
    checkFormValidity() {
      const valid = (this.$refs as any).form.checkValidity() as boolean;
      this.usernameState = valid;
      return valid;
    },
    login() {
      if (!this.checkFormValidity()) {
        return;
      }
      userStore.login(this.loginForm);
      this.$router.push(this.redirectPage);
    },
  },
});
</script>

<style scoped>
.login-form {
  width: 80%;
}
</style>
