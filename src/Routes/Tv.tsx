import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utilis";
import { getOnairTvs, IGetOnAirTvResult } from "../api";

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
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 48px;
    margin-bottom: 120px;
`;

const Overview = styled.p`
    position: relative;
    top: -120px;
    font-size: 18px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -510px;
    right: -1120px;
`;

const Column = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-rows: repeat(6, 1fr);
    position: absolute;
    width: 10%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    position: relative;
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 80px;
    font-size: 66px;
    cursor: pointer;
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

const colVariants = {
    invisible: {
        y: window.outerHeight + 5,
    },
    visible: {
        y: 0,
    },
    exit: {
        y: -window.outerHeight - 5,
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
    const { data, isLoading } = useQuery<IGetOnAirTvResult>(
        ["tvs", "onair"],
        getOnairTvs
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalTvs = data.results.length - 1;
            const maxIndex = Math.floor(totalTvs / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const onBoxClicked = (tvid: string) => {
        history.push(`/tvs/${tvid}`);
    };
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
                    >
                        <Title>{data?.results[0].original_name}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider onClick={increaseIndex}>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving}
                        >
                            <Column
                                variants={colVariants}
                                initial="invisible"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(
                                        offset * index,
                                        offset * index + offset
                                    )
                                    .map((tv) => (
                                        <Box
                                            layoutId={tv.id + ""}
                                            key={tv.id}
                                            onClick={() => onBoxClicked}
                                            bgPhoto={makeImagePath(
                                                tv.backdrop_path,
                                                "w500"
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
                            </Column>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Tv;
