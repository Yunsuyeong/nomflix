import styled from "styled-components";

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

function Tv() {
    return (
        <Wrapper>
            <Loader>Loading...</Loader>
        </Wrapper>
    );
}

export default Tv;
