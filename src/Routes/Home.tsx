import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
    getNowMovies,
    getTopMovies,
    getUpMovies,
    IGetNowMoviesResult,
    IGetTopMoviesResult,
    IGetUpMoviesResult,
} from "../api";
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

const Slider3 = styled.div`
    position: relative;
    top: -100px;
`;

const SliderTop = styled.div`
    display: flex;
    gap: 20px;
`;

const SlideBtn1 = styled.button`
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

const SlideBtn2 = styled.button`
    color: white;
    background: #ee004b;
    background: linear-gradient(0deg, #ee004b 0%, #fb0202 100%);
    width: 60px;
    height: 20px;
    padding: 0;
    border-radius: 15px;
    margin-top: 30px;
    &:hover {
        background: white;
        transition: all 0.3s ease;
        box-shadow: none;
        color: #fb0202;
    }
`;

const SlideBtn3 = styled.button`
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

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(
        "/movies/:movieId"
    );
    const { scrollY } = useViewportScroll();
    const { data, isLoading: isLoading1 } = useQuery<IGetNowMoviesResult>(
        ["movies", "nowPlaying"],
        getNowMovies
    );
    const { data: Topdata, isLoading: isLoading2 } =
        useQuery<IGetTopMoviesResult>(["movies", "topRated"], getTopMovies);

    const { data: Updata, isLoading: isLoading3 } =
        useQuery<IGetUpMoviesResult>(["movies", "upcoming"], getUpMovies);
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [index3, setIndex3] = useState(0);
    const [leaving1, setLeaving1] = useState(false);
    const [leaving2, setLeaving2] = useState(false);
    const [leaving3, setLeaving3] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving1) return;
            toggleLeaving1();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex2 = () => {
        if (Topdata) {
            if (leaving2) return;
            toggleLeaving2();
            const totalMovies = Topdata.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex3 = () => {
        if (Updata) {
            if (leaving2) return;
            toggleLeaving3();
            const totalMovies = Updata.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const toggleLeaving1 = () => setLeaving1((prev) => !prev);
    const toggleLeaving2 = () => setLeaving2((prev) => !prev);
    const toggleLeaving3 = () => setLeaving3((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClick = () => history.push("/");
    const clickedMovie1 =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => movie.id === +bigMovieMatch.params.movieId
        );
    const clickedMovie2 =
        bigMovieMatch?.params.movieId &&
        Topdata?.results.find(
            (movie) => movie.id === +bigMovieMatch.params.movieId
        );
    const clickedMovie3 =
        bigMovieMatch?.params.movieId &&
        Updata?.results.find(
            (movie) => movie.id === +bigMovieMatch.params.movieId
        );
    return (
        <Wrapper>
            {isLoading1 ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || "",
                            "original"
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <SliderTop>
                            <SliderTitle>Now_playing</SliderTitle>
                            <SlideBtn1 onClick={increaseIndex}>Slide</SlideBtn1>
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
                                {data?.results
                                    .slice(1)
                                    .slice(
                                        offset * index1,
                                        offset * index1 + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                            <SliderTitle>Top_rated</SliderTitle>
                            <SlideBtn2 onClick={increaseIndex2}>
                                Slide
                            </SlideBtn2>
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
                                {Topdata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index2,
                                        offset * index2 + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                    </Slider2>
                    <Slider3>
                        <SliderTop>
                            <SliderTitle>Upcoming</SliderTitle>
                            <SlideBtn3 onClick={increaseIndex3}>
                                Slide
                            </SlideBtn3>
                        </SliderTop>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving3}
                        >
                            <Row
                                variants={rowVariants}
                                initial="invisible"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index3}
                            >
                                {Updata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index3,
                                        offset * index3 + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                    </Slider3>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigMovie
                                    style={{ top: scrollY.get() + 100 }}
                                    layoutId={bigMovieMatch.params.movieId}
                                >
                                    {clickedMovie1 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie1.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie1.title}
                                            </BigTitle>
                                            <BigDate>
                                                Release :{" "}
                                                {clickedMovie1.release_date}
                                            </BigDate>
                                            <BigOverview>
                                                {clickedMovie1.overview.length >
                                                400
                                                    ? clickedMovie1.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedMovie1.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                    {clickedMovie2 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie2.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie2.title}
                                            </BigTitle>
                                            <BigDate>
                                                Release :{" "}
                                                {clickedMovie2.release_date}
                                            </BigDate>
                                            <BigOverview>
                                                {clickedMovie2.overview.length >
                                                400
                                                    ? clickedMovie2.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedMovie2.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                    {clickedMovie3 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie3.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie3.title}
                                            </BigTitle>
                                            <BigDate>
                                                Release :{" "}
                                                {clickedMovie3.release_date}
                                            </BigDate>
                                            <BigOverview>
                                                {clickedMovie3.overview.length >
                                                400
                                                    ? clickedMovie3.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedMovie3.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
