<template>
  <div v-if="movie">
    <div class="general-info-container pb-4">
      <b-row>
        <b-col cols="6">
          <h3>{{ movie.title }}</h3>
          <span>{{ movie.releaseDate }}</span>
        </b-col>
        <b-col cols="6" class="movie-rating">
          <b-col cols="3">
            <div>Rating</div>
            <div class="mt-2">
              <b-icon icon="star-fill" scale="1.6" color="#f5c518"></b-icon>
              <span class="point">{{ movie.voteAvarage }}</span
              >/<span>10</span>
            </div>
          </b-col>
          <b-col cols="3">
            <div>Popularity</div>
            <div class="mt-2">
              <span class="point">{{ movie.popularity | fixDigitBy0 }}</span>
            </div>
          </b-col>
        </b-col>
      </b-row>
      <b-row class="links mt-3">
        <div class="mr-3">
          <b-link> Cast Review </b-link>
        </div>
        <div class="mr-3">
          <b-link> User reviews </b-link>
        </div>
        <div class="mr-3">
          <b-link> All Topics </b-link>
        </div>
      </b-row>
      <b-row class="mt-4 movie-detail-section">
        <b-col cols="8" class="info">
          <div>
            <img
              :src="`${posterPathBaseUrl}/${movie.posterPath}`"
              alt="movie-img"
            />
          </div>
          <div>
            <div class="genre">
              <b-button
                pill
                variant="dark"
                :key="genre"
                v-for="genre in movie.genres"
                >{{ genre }}</b-button
              >
            </div>
            <div>
              <p>
                {{ movie.overview }}
              </p>
            </div>
            <hr />
            <div>
              <span class="title">Production Companies:</span>
              <span>
                {{companyNames.join(" - ")}}
              </span>
            </div>
          </div>
        </b-col>
        <b-col cols="4" class="button-section">
          <b-button
            v-if="isFavourite(movie.id)"
            @click="removeFromFavourite(movie.id)"
          >
            <b-icon icon="star-fill" color="yellow"></b-icon>
            Remove from Favourite
          </b-button>
          <b-button v-else @click="addToFavourite(movie.id)">
            <b-icon icon="star"></b-icon>
            Add to Favourite
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div class="details-container mb-3">
      <b-row class="mt-5">
        <b-col cols="8">
          <div class="more-like-this mb-5">
            <h3 class="section-title">More Like This</h3>
            <movie-carousel
              :movies="similarMovies"
              :favourite-movie-ids="favouriteMovieIds"
              :swiper-options="swiperOptions"
              @add-to-favourite="addToFavourite"
              @remove-from-favourite="removeFromFavourite"
            />
          </div>
          <div class="storyline mb-5">
            <h3 class="section-title">Storyline</h3>
            <div>
              <p>
                {{ movie.overview }}
              </p>
            </div>
            <div>
              <span class="title">Genres</span>
              <b-link class="mr-2" :key="genre" v-for="genre in movie.genres">{{
                genre
              }}</b-link>
            </div>
          </div>
          <div class="details mt-5">
            <h3 class="section-title">Details</h3>
            <div>
              <span class="title">Release Date</span>
              <span>{{ movie.releaseDate }}</span>
            </div>
            <hr />
            <div>
              <span class="title">Country of origin</span>
              <span>{{ movie.country }}</span>
            </div>
            <hr />
            <div>
              <span class="title">Language</span>
              <span>{{ movie.language }}</span>
            </div>
            <hr />
          </div>
        </b-col>
        <b-col cols="4">
          <div class="more-to-explore">
            <h3 class="section-title">More to explore</h3>
            <div>Under maintanance</div>
          </div>
        </b-col>
      </b-row>
      <b-modal hide-footer hide-header id="error-modal">
        You must login to add favourite
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MovieCarousel from "~/components/MovieCarousel.vue";
import { movieStore, userStore } from "~/store";
import { MovieDetail, Movie, ProductionCompany } from "~/types/Movie";

interface Data {
  movie: MovieDetail | null;
  similarMovies: Movie[];
  posterPathBaseUrl: string;
  swiperOptions: any;
  favouriteMovieIds: number[];
}

export default Vue.extend({
  components: { MovieCarousel },
  data(): Data {
    return {
      movie: null,
      posterPathBaseUrl: process.env.PosterPath || "",
      similarMovies: [],
      swiperOptions: {
        slidesPerView: 4,
        slidesPerGroup: 2,
        spaceBetween: 2,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      favouriteMovieIds: movieStore.getFavouriteMovieIds,
    };
  },
  computed: {
    companyNames(): string[] {
      if (this.movie) {
        return this.movie.productionCompanies.map((company: ProductionCompany) => company.name)
      }
      return []
    }
  },
  async created() {
    const { APIKey: apiKey } = process.env;
    const movieId = this.$route.params.id;
    const query = `movie/${movieId}?api_key=${apiKey}`;
    const res = await this.$axios.get(query);
    const genres = res.data.genres.map((genre: any) => {
      return genre.name;
    });
    const productionCompanies = res.data.production_companies.map(
      (company: any) => {
        return {
          name: company.name,
          id: company.id,
        };
      }
    );
    this.movie = {
      id: res.data.id,
      posterPath: res.data.poster_path,
      genres,
      title: res.data.title,
      overview: res.data.overview,
      popularity: res.data.popularity,
      releaseDate: res.data.release_date,
      voteCount: res.data.vote_count,
      voteAvarage: res.data.vote_average,
      revenue: res.data.revenue,
      tagline: res.data.tagline,
      country: res.data.production_countries[0].name,
      language: res.data.original_language,
      productionCompanies,
    };
    this.similarMovies = await this.getSimilarMovies(movieId);
  },
  methods: {
    async getSimilarMovies(movieId: string): Promise<Movie[]> {
      const { APIKey: apiKey } = process.env;
      const query = `movie/${movieId}/similar?api_key=${apiKey}`;
      const res = await this.$axios.get(query);
      const movies: Movie[] = res.data.results.map((movie: any) => {
        return {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAvarage: movie.vote_average,
          voteCount: movie.vote_count,
        };
      });
      return movies;
    },
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
  },
});
</script>

<style scoped>
.general-info-container {
  padding-top: 2%;
  padding-left: 8%;
  padding-right: 8%;
  color: white;
  background: #1f1f1f;
}
.details-container {
  padding-top: 2%;
  padding-left: 8%;
  padding-right: 8%;
}
.details hr {
  border-top-color: black;
}
.movie-rating {
  text-align: center;
  display: flex;
  justify-content: right;
}
.point {
  margin-left: 0.5rem;
}
.links {
  background: #313131;
  display: flex;
  justify-content: right;
  padding: 2%;
}
.links a {
  color: white;
}

.genre {
  display: flex;
}
.movie-detail-section .info {
  display: flex;
}
.movie-detail-section .info div {
  padding-left: 0.3em;
  margin-top: 1em;
}
.movie-detail-section img {
  width: 80%;
  min-width: 120px;
  padding-bottom: 1em;
}
.movie-detail-section hr {
  border-top-color: white;
}

.button-section button {
  width: 100%;
  padding: 1em;
  text-align: left;
  font-weight: bold;
  background: #313131;
  border: none;
}
.button-section button:hover {
  background: #4a4a4a;
}

.title {
  font-weight: bold;
  margin-right: 1em;
}

.genre button {
  border-color: white;
  background-color: #1f1f1f;
}
.section-title {
  font-weight: bold;
  margin-bottom: 1.2em;
}
.section-title::before {
  background: #f5c518;
  border-radius: 1px;
  content: "";
  margin-left: -0.75rem;
  position: absolute;
  height: 1.2em;
  width: 4px;
}
.more-like-this /deep/ .swiper-slide {
  height: auto;
}
</style>
