<template>
  <div>
    <b-row>
      <b-col cols="2"></b-col>
      <b-col cols="10">
        <movie-long-card
          :key="movie.id"
          v-for="movie in movies"
          :movie="movie"
        />
        <b-pagination
          v-if="totalRows >= perPage"
          align="center"
          @change="onPageChanged"
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          class="mt-3 mb-4"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Movie } from "types/Movie";
import MovieLongCard from "~/components/MovieLongCard.vue";

interface Data {
  movies: Movie[];
  totalRows: number;
  perPage: number;
  currentPage: number;
}

export default Vue.extend({
  components: { MovieLongCard },
  data(): Data {
    return {
      movies: [],
      totalRows: 0,
      perPage: 20,
      currentPage: 1,
    };
  },
  watch: {
    "$route.query": {
      handler: async function () {
        await this.setMovies();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onPageChanged(page: number) {
      await this.setMovies(page);
    },
    async setMovies(page = 1) {
      const { APIKey: apiKey } = process.env;
      const movieName = this.$route.query.name;
      const { genre } = this.$route.query;

      let query = "";
      if (!genre) {
        query = `search/movie?api_key=${apiKey}&query=${movieName}&page=${page}`;
      } else if (genre === "trends") {
        query = `trending/movie/week?api_key=${apiKey}&page=${page}`;
      } else {
        query = `discover/movie?api_key=${apiKey}&with_genres=${genre}&page=${page}`;
      }
      const res = await this.$axios.get(query);
      const allMovies = res.data.results.map((movie: any) => {
        return {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAvarage: movie.vote_average,
          voteCount: movie.vote_count,
          overview: movie.overview,
          releaseDate: movie.release_date,
        };
      });
      this.totalRows = res.data.total_results;
      this.movies = allMovies;
    },
  },
});
</script>

<style scoped>
.row {
  margin-right: 0;
}
</style>
