export interface IGetNowMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetTopMoviesResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetUpMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetSearchMovieResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

interface IMovie {
    backdrop_path: string;
    poster_path: string;
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
}

export interface IGetOnairTvsResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export interface IGetAiringTvsResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export interface IGetPopularTvsResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export interface IGetTopTvsResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export interface IGetSearchTvResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

interface ITv {
    backdrop_path: string;
    poster_path: string;
    first_air_date: string;
    id: number;
    original_name: string;
    overview: string;
    vote_average: number;
}

export async function getNowMovies() {
    return await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getTopMovies() {
    return await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getUpMovies() {
    return await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getOnairTvs() {
    return await fetch(
        `https://api.themoviedb.org/3/tv/on_the_air?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getAiringTvs() {
    return await fetch(
        `https://api.themoviedb.org/3/tv/airing_today?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getPopularTvs() {
    return await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=9633d3074eb0813143d2c4cf83a6046b`
    ).then((response) => response.json());
}

export async function getTopTvs() {
    return await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=9633d3074eb0813143d2c4cf83a6046b&language=en-US&page=1`
    ).then((response) => response.json());
}
