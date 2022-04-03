import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { User } from '~/types/User'
import { movieStore } from '.'

@Module({
    name: 'user',
    stateFactory: true,
    namespaced: true,
})
export default class UserModule extends VuexModule {
    user: User | null = null

    @Mutation
    login(user: User) {
        this.user = user
        movieStore.setUserFavouriteMovies(user.username)
    }

    @Mutation
    logout() {
        this.user = null
    }

    get loggedInUser() {
        return this.user
    }

    get isLoggedIn() {
        if (this.user) {
            return true
        }
        return false
    }
}
