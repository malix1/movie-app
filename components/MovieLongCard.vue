<template>
  <b-row class="movie-card">
    <b-col cols="1" class="poster">
      <img :src="`${posterPathBaseUrl}/${movie.posterPath}`" alt="" />
    </b-col>
    <b-col cols="11">
      <div class="ml-3">
        <b-link @click="goToDetail">{{ movie.title }}</b-link>
        <span>{{ movie.releaseDate }}</span>
      </div>
      <div class="ml-3 mt-3">
        <p class="overview">
          {{ movie.overview }}
        </p>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MovieDetail } from "~/types/Movie";

interface Data {
  posterPathBaseUrl: string;
}

export default Vue.extend({
  props: {
    movie: {
      default: null,
      required: true,
      type: Object as PropType<MovieDetail>,
    },
  },
  data(): Data {
    return {
      posterPathBaseUrl: process.env.PosterPath || "",
    };
  },
  methods: {
    goToDetail() {
      if (this.movie) {
        this.$router.push(`/movie/${this.movie.id}`)
      }
    }
  }
});
</script>

<style scoped>
h4 {
  font-weight: bold;
}
.poster {
  padding-left: 0;
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 5px;
}
.movie-card {
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  margin: 1% 1% 1% 0px;
  box-shadow: 0px 0px 2px 2px #bcbcbc;
}
.overview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
a {
  display: block;
  color: black;
}
</style>
