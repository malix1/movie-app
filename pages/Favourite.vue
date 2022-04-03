<template>
  <div class="page-body">
    <b-row>
      <b-col cols="12" class="mb-4">
        <h3>Favourite</h3>
      </b-col>
      <b-col cols="2" class="mb-2" :key="movie.id" v-for="movie in movies">
        <movie-carousel-card
          :movie="movie"
          :favourite-movie-ids="favouriteMovieIds"
          @remove-from-favourite="removeFromFavourite"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MovieCarouselCard from "~/components/MovieCarouselCard.vue";
import { movieStore, userStore } from "~/store";
import { Movie } from "~/types/Movie";

interface Data {
  movies: Movie[];
    favouriteMovieIds: number[];
}

export default Vue.extend({
  components: { MovieCarouselCard },
  data(): Data {
    return {
      movies: [],
          favouriteMovieIds: movieStore.getFavouriteMovieIds,
    };
  },
  async created() {
    if (userStore.isLoggedIn) {
      const { APIKey: apiKey } = process.env;
      const res = await this.favouriteMovieIds.map(async (id: number) => {
        const query = `movie/${id}?api_key=${apiKey}`;
        const res = await this.$axios.get(query);
        return {
          id: res.data.id,
          posterPath: res.data.poster_path,
          title: res.data.title,
          popularity: res.data.popularity,
          voteCount: res.data.vote_count,
          voteAvarage: res.data.vote_average
        };
      });
      this.movies = await Promise.all(res)
    } else {
      (this as any).$bvModal.show("error-modal");
      this.$router.push("/");
    }
  },
  methods: {
    removeFromFavourite(movieId: number) {
      if (userStore.isLoggedIn) {
        movieStore.removeFromFavourite(movieId)
        this.movies = this.movies.filter(
          (movie: Movie) => movie.id !== movieId
        );
      }
    },
  },
});
</script>

<style scoped>
.page-body {
  padding-top: 2%;
  padding-left: 8%;
  padding-right: 8%;
} 
</style>
