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

interface IMovie {
    backdrop_path: string;
    poster_path: string;
    id: number;
    title: string;
    overview: string;
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
