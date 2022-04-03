import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import UserModule from '~/store/user'
import MovieModule from '~/store/movie'

let userStore: UserModule
let movieStore: MovieModule

function initialiseStores(store: Store<any>): void {
  userStore = getModule(UserModule, store),
  movieStore = getModule(MovieModule, store)
}

export { initialiseStores, userStore, movieStore }