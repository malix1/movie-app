import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { userStore } from '.'

@Module({
    name: 'movie',
    stateFactory: true,
    namespaced: true,
})
export default class MovieModule extends VuexModule {
    favouriteMovies: number[] = []

    @Mutation
    updateFavouriteMovies(movies: number[]) {
        this.favouriteMovies = movies
    }

    @Action
    addToFavourite(movieId: number) {
        const username = (userStore.loggedInUser && userStore.loggedInUser.username) || "";
        let movies = JSON.parse(localStorage.getItem(username) || "[]")
        movies.push(movieId)
        localStorage.setItem(username, JSON.stringify(movies))
        this.context.commit("updateFavouriteMovies", movies)
    }

    @Action
    removeFromFavourite(movieId: number) {
        const username = (userStore.loggedInUser && userStore.loggedInUser.username) || "";
        let movies = JSON.parse(localStorage.getItem(username) || "[]")
        movies = movies.filter((id: number) => id !== movieId)
        localStorage.setItem(username, JSON.stringify(movies))
        this.context.commit("updateFavouriteMovies", movies)
    }

    @Action
    setUserFavouriteMovies(username: string) {
        const movies = JSON.parse(localStorage.getItem(username) || "[]")
        this.context.commit("updateFavouriteMovies", movies)
    }

    get getFavouriteMovieIds() {
        return this.favouriteMovies
    }
}