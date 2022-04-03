<template>
  <div>
    <b-navbar type="light" variant="light">
      <b-navbar-brand to="/">Movie App</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-form @submit.prevent="onSearch">
          <b-input-group>
            <b-form-input
              placeholder="Movie"
              v-model="movieName"
            ></b-form-input>
            <b-input-group-append>
              <b-input-group-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/favourite">Favourite</b-nav-item>
        <b-nav-item-dropdown
          v-if="loggedInUser"
          :text="`Welcome ${loggedInUser.username}`"
          right
        >
          <b-dropdown-item @click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else @click="goLoginPage">Login</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { userStore } from "~/store";
import { User } from "~/types/User";

interface Data {
  movieName: string;
}

export default Vue.extend({
  data(): Data {
    return {
      movieName: "",
    };
  },
  computed: {
    loggedInUser() {
      return userStore.loggedInUser
    }
  },
  methods: {
    onSearch() {
      this.$router.push(`/movie/search?name=${this.movieName}`);
      this.movieName = "";
    },
    logout() {
      userStore.logout();
      location.reload()
    },
    goLoginPage() {
      const fullPath = this.$route.fullPath
      this.$router.push(`/login?page=${fullPath}`)
    }
  },
});
</script>

<style scoped></style>
