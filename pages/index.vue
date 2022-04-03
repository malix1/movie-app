<template>
  <div>
    <b-row class="movie-carousel">
      <b-col sm="12">
        <b-link style="float: right" @click="goToSeeMore('trends')"
          >See more</b-link
        >
        <h4>Trend in this week</h4>
      </b-col>
      <movie-carousel
        :movies="movies.trends"
        :favourite-movie-ids="favouriteMovieIds"
        @add-to-favourite="addToFavourite"
        @remove-from-favourite="removeFromFavourite"
      />
    </b-row>
    <b-row class="movie-carousel">
      <b-col sm="12">
        <b-link style="float: right" @click="goToSeeMore('animation')"
          >See more</b-link
        >
        <h4>Animation</h4>
      </b-col>
      <movie-carousel
        :movies="movies.animation"
        :favourite-movie-ids="favouriteMovieIds"
        @add-to-favourite="addToFavourite"
        @remove-from-favourite="removeFromFavourite"
      />
    </b-row>
    <b-row class="movie-carousel">
      <b-col sm="12">
        <b-link style="float: right" @click="goToSeeMore('action')"
          >See more</b-link
        >
        <h4>Action</h4>
      </b-col>
      <movie-carousel
        :movies="movies.action"
        :favourite-movie-ids="favouriteMovieIds"
        @add-to-favourite="addToFavourite"
        @remove-from-favourite="removeFromFavourite"
      />
    </b-row>
    <b-row class="movie-carousel mb-4">
      <b-col sm="12">
        <b-link style="float: right" @click="goToSeeMore('comedy')"
          >See more</b-link
        >
        <h4>Comedy</h4>
      </b-col>
      <movie-carousel
        :movies="movies.comedy"
        :favourite-movie-ids="favouriteMovieIds"
        @add-to-favourite="addToFavourite"
        @remove-from-favourite="removeFromFavourite"
      />
    </b-row>
    <b-modal hide-footer hide-header id="error-modal">
      You must login to add favourite
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MovieCarousel from "~/components/MovieCarousel.vue";
import { Movie, Genre } from "types/Movie";
import { genres } from "~/utils/variables";
import { movieStore, userStore } from "~/store";

interface AllMovies {
  action: Movie[];
  comedy: Movie[];
  animation: Movie[];
  trends: Movie[];
}

interface Data {
  movies: AllMovies;
  genres: Genre[];
  favouriteMovieIds: number[];
}

export default Vue.extend({
  components: { MovieCarousel },
  name: "HomePage",
  data(): Data {
    return {
      movies: {
        action: [],
        comedy: [],
        animation: [],
        trends: [],
      },
      genres,
      favouriteMovieIds: movieStore.getFavouriteMovieIds,
    };
  },
  async created() {
    const { APIKey: apiKey } = process.env;
    let query = "";
    genres.forEach(async (genre: Genre) => {
      if (genre.name === "trends") {
        query = `trending/movie/week?api_key=${apiKey}`;
      } else {
        query = `discover/movie?api_key=${apiKey}&with_genres=${genre.id}`;
      }
      const res = await this.$axios.get(query);
      const movies = res.data.results.map((movie: any) => {
        return {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAvarage: movie.vote_average,
          voteCount: movie.vote_count,
        };
      });
      this.movies[genre.name as keyof AllMovies] = movies;
    });
  },
  methods: {
    addToFavourite(movieId: number) {
      if (userStore.isLoggedIn) {
        movieStore.addToFavourite(movieId);
        this.favouriteMovieIds = movieStore.getFavouriteMovieIds;
      } else {
        (this as any).$bvModal.show("error-modal");
      }
    },
    removeFromFavourite(movieId: number) {
      if (userStore.isLoggedIn) {
        movieStore.removeFromFavourite(movieId);
        this.favouriteMovieIds = movieStore.getFavouriteMovieIds;
      }
    },
    isFavourite(movieId: number): boolean {
      return (
        this.favouriteMovieIds.findIndex((id: number) => id === movieId) !== -1
      );
    },
    goToSeeMore(genreName: string) {
      const { APIKey: apiKey } = process.env;
      let query = "";
      const genre = this.getGenre(genreName)
      if (!genre) {
        return;
      } else if (genre.name === "trends") {
        query = '?genre=trends'
      } else {
        query = `?genre=${genre.id}`
      }
      this.$router.push(`/movie/search/${query}`)
    },
    getGenre(genreName: string): Genre | undefined {
      return this.genres.find((genre: Genre) => genre.name === genreName)
    }
  },
});
</script>
<style>
.movie-carousel {
  margin-left: 8%;
  margin-right: 8%;
  margin-top: 3%;
}
body {
  background: #e8e8e8;
}
</style>
