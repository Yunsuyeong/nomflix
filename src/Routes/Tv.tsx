import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utilis";
import {
    getAiringTvs,
    getTopTvs,
    IGetAiringTvsResult,
    IGetTopTvsResult,
    IGetPopularTvsResult,
    getPopularTvs,
    getOnairTvs,
    IGetOnairTvsResult,
} from "../api";

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

const Slider4 = styled.div`
    position: relative;
    top: -800px;
`;

const Slider1 = styled.div`
    position: relative;
    top: -650px;
`;

const Slider2 = styled.div`
    position: relative;
    top: -500px;
`;

const Slider3 = styled.div`
    position: relative;
    top: -350px;
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

const BigVoting = styled.h4`
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

function Tv() {
    const history = useHistory();
    const { scrollY } = useViewportScroll();
    const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
    const { data, isLoading } = useQuery<IGetAiringTvsResult>(
        ["tvs", "airing"],
        getAiringTvs
    );
    const { data: Populardata, isLoading: isLoading2 } =
        useQuery<IGetPopularTvsResult>(["tvs", "popular"], getPopularTvs);
    const { data: Topdata, isLoading: isLoading3 } = useQuery<IGetTopTvsResult>(
        ["tvs", "topRated"],
        getTopTvs
    );
    const { data: Onairdata, isLoading: isLoading4 } =
        useQuery<IGetOnairTvsResult>(["tvs", "onair"], getOnairTvs);
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [index3, setIndex3] = useState(0);
    const [index4, setIndex4] = useState(0);
    const [leaving1, setLeaving1] = useState(false);
    const [leaving2, setLeaving2] = useState(false);
    const [leaving3, setLeaving3] = useState(false);
    const [leaving4, setLeaving4] = useState(false);
    const toggleLeaving1 = () => setLeaving1((prev) => !prev);
    const toggleLeaving2 = () => setLeaving2((prev) => !prev);
    const toggleLeaving3 = () => setLeaving3((prev) => !prev);
    const toggleLeaving4 = () => setLeaving4((prev) => !prev);
    const increaseIndex1 = () => {
        if (data) {
            if (leaving1) return;
            toggleLeaving1();
            const totalTvs = data.results.length - 1;
            const maxIndex = Math.floor(totalTvs / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex2 = () => {
        if (Populardata) {
            if (leaving2) return;
            toggleLeaving2();
            const totalTvs = Populardata.results.length - 1;
            const maxIndex = Math.floor(totalTvs / offset) - 1;
            setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex3 = () => {
        if (Topdata) {
            if (leaving3) return;
            toggleLeaving3();
            const totalTvs = Topdata.results.length - 1;
            const maxIndex = Math.floor(totalTvs / offset) - 1;
            setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex4 = () => {
        if (Onairdata) {
            if (leaving4) return;
            toggleLeaving4();
            const totalTvs = Onairdata.results.length - 1;
            const maxIndex = Math.floor(totalTvs / offset) - 1;
            setIndex4((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const onBoxClicked = (tvId: number) => {
        history.push(`/tv/${tvId}`);
    };
    const onOverlayClick = () => history.push(`/tv`);
    const clickedTv1 =
        bigTvMatch?.params.tvId &&
        data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
    const clickedTv2 =
        bigTvMatch?.params.tvId &&
        Populardata?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
    const clickedTv3 =
        bigTvMatch?.params.tvId &&
        Topdata?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
    const clickedTv4 =
        bigTvMatch?.params.tvId &&
        Onairdata?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    ></Banner>
                    <Slider4>
                        <SliderTop>
                            <SliderTitle>On_air</SliderTitle>
                            <SlideBtn1 onClick={increaseIndex4}>
                                Slide
                            </SlideBtn1>
                        </SliderTop>

                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving4}
                        >
                            <Row
                                variants={rowVariants}
                                initial="invisible"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index4}
                            >
                                {Onairdata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index4,
                                        offset * index4 + offset
                                    )
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            onClick={() => onBoxClicked(tv.id)}
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
                    </Slider4>
                    <Slider1>
                        <SliderTop>
                            <SliderTitle>Airing</SliderTitle>
                            <SlideBtn1 onClick={increaseIndex1}>
                                Slide
                            </SlideBtn1>
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
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            onClick={() => onBoxClicked(tv.id)}
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
                    </Slider1>
                    <Slider2>
                        <SliderTop>
                            <SliderTitle>Popular</SliderTitle>
                            <SlideBtn2 onClick={increaseIndex2}>
                                Silde
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
                                {Populardata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index2,
                                        offset * index2 + offset
                                    )
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            onClick={() => onBoxClicked(tv.id)}
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
                    <Slider3>
                        <SliderTop>
                            <SliderTitle>Top_rated</SliderTitle>
                            <SlideBtn2 onClick={increaseIndex3}>
                                Slide
                            </SlideBtn2>
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
                                transition={{ type: "Tween", duration: 1 }}
                                key={index3}
                            >
                                {Topdata?.results
                                    .slice(1)
                                    .slice(
                                        offset * index3,
                                        offset * index3 + offset
                                    )
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            onClick={() => onBoxClicked(tv.id)}
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
                    </Slider3>
                    <AnimatePresence>
                        {bigTvMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigMovie
                                    style={{ top: scrollY.get() + 100 }}
                                    layoutId={bigTvMatch.params.tvId}
                                >
                                    {clickedTv4 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv4.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedTv4.original_name} (
                                                {clickedTv4.first_air_date.slice(
                                                    0,
                                                    4
                                                )}
                                                )
                                            </BigTitle>
                                            <BigVoting>
                                                Voting :{" "}
                                                {clickedTv4.vote_average}
                                            </BigVoting>
                                            <BigOverview>
                                                {clickedTv4.overview.length >
                                                400
                                                    ? clickedTv4.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedTv4.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                    {clickedTv1 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv1.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedTv1.original_name} (
                                                {clickedTv1.first_air_date.slice(
                                                    0,
                                                    4
                                                )}
                                                )
                                            </BigTitle>
                                            <BigVoting>
                                                Voting :{" "}
                                                {clickedTv1.vote_average}
                                            </BigVoting>
                                            <BigOverview>
                                                {clickedTv1.overview.length >
                                                400
                                                    ? clickedTv1.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedTv1.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                    {clickedTv2 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv2.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedTv2.original_name} (
                                                {clickedTv2.first_air_date.slice(
                                                    0,
                                                    4
                                                )}
                                                )
                                            </BigTitle>
                                            <BigVoting>
                                                Voting :{" "}
                                                {clickedTv2.vote_average}
                                            </BigVoting>
                                            <BigOverview>
                                                {clickedTv2.overview.length >
                                                400
                                                    ? clickedTv2.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedTv2.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                    {clickedTv3 && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv3.backdrop_path,
                                                        "original"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedTv3.original_name} (
                                                {clickedTv3.first_air_date.slice(
                                                    0,
                                                    4
                                                )}
                                                )
                                            </BigTitle>
                                            <BigVoting>
                                                Voting :{" "}
                                                {clickedTv3.vote_average}
                                            </BigVoting>
                                            <BigOverview>
                                                {clickedTv3.overview.length >
                                                400
                                                    ? clickedTv3.overview.slice(
                                                          0,
                                                          400
                                                      )
                                                    : clickedTv3.overview}
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

export default Tv;
