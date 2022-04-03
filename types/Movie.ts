export interface Movie {
    id: number
    title: string
    posterPath?: string
    voteAvarage: number
    voteCount: number
    overview?: string
    releaseDate?: string
}

export interface ProductionCompany {
    id: number
    name: string
}

export interface MovieDetail {
    posterPath?: string
    genres: string[]
    id: number
    title: string
    tagline: string
    revenue: number
    overview: string
    popularity: number
    releaseDate: string
    voteAvarage: number
    voteCount: number
    country: string
    language: string
    productionCompanies: ProductionCompany[]
}

export interface Genre {
    id: number
    name: string
}