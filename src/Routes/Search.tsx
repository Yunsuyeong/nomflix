import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { stringify } from "querystring";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetSearchMovieResult, IGetSearchTvResult } from "../api";
import { makeImagePath } from "../utilis";

const Wrapper = styled.div`
    background: #95a5a6;
    color: ${(props) => props.theme.white.darker};
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 120vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    position: relative;
    top: -120px;
    font-size: 48px;
    margin-bottom: 120px;
`;

const Overview = styled.p`
    position: relative;
    top: -200px;
    font-size: 18px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -400px;
`;

const Slider2 = styled.div`
    position: relative;
    top: -250px;
`;

const SliderTop = styled.div`
    display: flex;
    gap: 20px;
`;

const SlideBtn = styled.button`
    color: white;
    background: rgb(0, 172, 238);
    background: linear-gradient(
        0deg,
        rgba(0, 172, 238, 1) 0%,
        rgba(2, 126, 251, 1) 100%
    );
    width: 60px;
    height: 20px;
    padding: 0;
    border-radius: 15px;
    margin-top: 30px;
    &:hover {
        background: white;
        transition: all 0.3s ease;
        box-shadow: none;
        color: rgba(2, 126, 251, 1);
    }
`;

const SliderTitle = styled.h4`
    color: ${(props) => props.theme.white.darker};
    font-size: 18px;
    margin-left: 10px;
    margin-bottom: 10px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    position: relative;
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 150px;
    font-size: 66px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 12px;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 300px;
`;

const BigTitle = styled.h2`
    position: relative;
    top: -20px;
    font-size: 28px;
    color: ${(props) => props.theme.white.lighter};
    padding-left: 10px;
`;

const BigDate = styled.h4`
    position: relative;
    top: -45px;
    font-size: 14px;
    color: ${(props) => props.theme.white.lighter};
    padding-left: 10px;
`;

const BigOverview = styled.p`
    position: relative;
    top: -60px;
    color: ${(props) => props.theme.white.lighter};
    font-size: 16px;
    padding-left: 10px;
`;

const rowVariants = {
    invisible: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        zIndex: 99,
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
    },
};

const offset = 6;

function Search() {
    const { scrollY } = useViewportScroll();
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    async function getSearchMovieResults() {
        return await fetch(`
        https://api.themoviedb.org/3/search/movie?api_key=9633d3074eb0813143d2c4cf83a6046b&language=en-US&query=${keyword}&page=1&include_adult=false`).then(
            (response) => response.json()
        );
    }
    async function getSearchTvResults() {
        return await fetch(`
        https://api.themoviedb.org/3/search/tv?api_key=9633d3074eb0813143d2c4cf83a6046b&language=en-US&page=1&query=${keyword}&include_adult=false
        `).then((response) => response.json());
    }
    const { data: Moviedata, isLoading: isLoading1 } =
        useQuery<IGetSearchMovieResult>(
            ["movies", "search"],
            getSearchMovieResults
        );
    const { data: Tvdata, isLoading: isLoading2 } =
        useQuery<IGetSearchTvResult>(["tvs", "search"], getSearchTvResults);

    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [leaving1, setLeaving1] = useState(false);
    const [leaving2, setLeaving2] = useState(false);
    const toggleLeaving1 = () => setLeaving1((prev) => !prev);
    const toggleLeaving2 = () => setLeaving2((prev) => !prev);
    const increaseIndex1 = () => {
        if (Moviedata) {
            if (leaving1) return;
            toggleLeaving1();
            const totalMovies = Moviedata.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex2 = () => {
        if (Tvdata) {
            if (leaving2) return;
            toggleLeaving2();
            const totalMovies = Tvdata.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    return (
        <Wrapper>
            {isLoading1 ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            Moviedata?.results[0].backdrop_path ||
                                Tvdata?.results[0].backdrop_path ||
                                "",
                            "original"
                        )}
                    >
                        <Title>
                            {Moviedata?.results[0].title ||
                                Tvdata?.results[0].original_name}
                        </Title>
                        <Overview>
                            {Moviedata?.results[0].overview ||
                                Tvdata?.results[0].overview}
                        </Overview>
                    </Banner>
                    <Slider>
                        <SliderTop>
                            <SliderTitle>Movie</SliderTitle>
                            <SlideBtn onClick={increaseIndex1}>Slide</SlideBtn>
                        </SliderTop>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving1}
                        >
                            <Row
                                variants={rowVariants}
                                initial="invisible"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index1}
                            >
                                {Moviedata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index1,
                                        offset * index1 + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            bgPhoto={makeImagePath(
                                                movie.backdrop_path,
                                                "original"
                                            )}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: "tween" }}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <Slider2>
                        <SliderTop>
                            <SliderTitle>Tv</SliderTitle>
                            <SlideBtn onClick={increaseIndex2}>Slide</SlideBtn>
                        </SliderTop>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving2}
                        >
                            <Row
                                variants={rowVariants}
                                initial="invisible"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index2}
                            >
                                {Tvdata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index2,
                                        offset * index2 + offset
                                    )
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            bgPhoto={makeImagePath(
                                                tv.backdrop_path,
                                                "original"
                                            )}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: "tween" }}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{tv.original_name}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider2>
                </>
            )}
        </Wrapper>
    );
}

export default Search;
