<template>
  <swiper :options="swiperOptions">
    <swiper-slide :key="movie.id" v-for="movie in movies">
      <movie-carousel-card
        :movie="movie"
        :favourite-movie-ids="favouriteMovieIds"
        @add-to-favourite="(movieId) => addToFavourite(movieId)"
        @remove-from-favourite="(movieId) => removeFromFavourite(movieId)"
      />
    </swiper-slide>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import { Movie } from "~/types/Movie";
import MovieCarouselCard from "./MovieCarouselCard.vue";

export default Vue.extend({
  components: { MovieCarouselCard },
  props: {
    favouriteMovieIds: {
      required: true,
      default: () => {
        return []
      },
      type: Array as PropType<number[]>
    },
    movies: {
      required: true,
      default: () => {
        return []
      },
      type: Array as PropType<Movie[]>
    },
    swiperOptions: {
      required: false,
      default: () => {
        return {
          slidesPerView: 6,
          slidesPerGroup: 2,
          spaceBetween: 2,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        };
      },
    },
  },
  methods: {
    addToFavourite(movieId: number) {
      this.$emit('add-to-favourite', movieId)
    },
    removeFromFavourite(movieId: number) {
      this.$emit('remove-from-favourite', movieId)
    }
  }
});
</script>

<style scoped></style>
