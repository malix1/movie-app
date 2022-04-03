<template>
  <b-card
    style="max-width: 15rem"
    :img-src="`${posterPathBaseUrl}/${movie.posterPath}`"
    img-alt="Image"
    img-top
    img-height="300"
  >
    <b-card-text>
      <b-icon icon="star-fill" color="yellow" />
      <span class="rate">{{ movie.voteAvarage | fixDigitBy1 }}</span>
    </b-card-text>
    <b-card-text>
      <b-link :to="`/movie/${movie.id}`" class="movie-name">
        {{ movie.title }}
      </b-link>
    </b-card-text>
    <template #footer>
      <b-button
        v-if="isFavourite(movie.id)"
        variant="info"
        @click="$emit('remove-from-favourite', movie.id)"
      >
        <b-icon icon="star-fill" class="mr-1" color="yellow"></b-icon>
        Favourite
      </b-button>
      <b-button
        v-else
        variant="info"
        class="mr-1"
        @click="$emit('add-to-favourite', movie.id)"
      >
        <b-icon icon="star"></b-icon>
        Favourite
      </b-button>
      <b-icon class="mt-2" scale="1.5" icon="info-circle-fill"></b-icon>
    </template>
  </b-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Movie } from "types/Movie";
import { PropType } from "vue";

interface Data {
  posterPathBaseUrl: string;
}

export default Vue.extend({
  props: {
    movie: {
      required: true,
      type: Object as PropType<Movie>,
      default: () => {
        return {
          id: "",
          title: "",
          posterPath: "",
          voteAvarage: 0,
          voteCount: 0,
          isFavourite: false,
        };
      },
    },
    favouriteMovieIds: {
      required: true,
      type: Array as PropType<number[]>,
      default: () => {
        return []
      }
    }
  },
  data(): Data {
    return {
      posterPathBaseUrl: process.env.PosterPath || "",
    };
  },
  methods: {
    isFavourite(movieId: number): boolean {
      return (
        this.favouriteMovieIds.findIndex((id: number) => id === movieId) !== -1
      );
    },
  },
});
</script>

<style scoped>
a {
  color: black;
}
a:hover {
  cursor: pointer;
}
.card {
  min-width: 180px;
  height: 100%;
  position: relative;
}
.card-footer {
  background: inherit;
  border: 0;
}
.card-footer > svg {
  position: absolute;
  right: 1.3em;
}
</style>
