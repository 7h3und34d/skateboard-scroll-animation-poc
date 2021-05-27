import React, {useState, useEffect, useMemo, useRef} from 'react'
import styled, { keyframes } from 'styled-components';
import s1 from './s1.jpg';
import s2 from './s2.jpg';
import s3 from './s3.jpg';
import s4 from './s4.jpg';
import s5 from './s5.jpg';
import s6 from './s5.png';
import s7 from './s6.png';
import s8 from './s7.png';
import s9 from './s9.jpg';
import s10 from './s10.jpg';
import s11 from './s11.jpg';

const imgs = [[s1, 'Lamber', '50'], [s2, 'Graphite', '150'], [s3, 'Predators', '200'], [s4, 'Pistache', '150'], [s5, 'Heart', '150'], [s6, 'Jeffo', '200'], [s7, 'Terror', '200'], [s8, 'Milk', '150'], [s9, 'Native', '200'], [s10, 'Vivid', '200'], [s11, 'Monsters', '100']];

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2e2e33;
  box-sizing: border-box;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface ObsProps {
  state: string;
  src: string;
}

const Img = styled.img<ObsProps>`
  filter: grayscale(${props => props.state === 'foc' ? 0 : 89}%);
  transition: all 1.5s;
  margin: 16px;
  height: 300px;
  width: 300px;
  box-shadow: ${props => props.state === 'foc' ? 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;' : ''};
  cursor: pointer;
  border-radius: 16px;
  box-sizing: border-box;
  /*background-image: url(${props => props.src});
  background-size: cover;*/
`;

const InfoBox = styled.div<{state: string}>`
  margin: 16px 0;
  opacity: ${props => props.state === "foc" ? 1 : 0};
  visibility: ${props => props.state === "foc" ? 'visible' : 'hidden'};
  width: ${props => props.state === "foc" ? 300 : 0}px;
  height: 300px;
  border-radius: 16px;
  box-sizing: border-box;
  padding: 20px;
  color: #fff;
  transition: width 0.3s, opacity 1s;
`;

interface ObservedImgProps {
  state: string;
  id: string;
  src: string,
  observer: IntersectionObserver
  name: string;
  usd: string;
}

const ObservedImg = ({ id, src, observer, state, name, usd }: ObservedImgProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef?.current) {
      observer.observe(imgRef.current)
    }
    return () => observer.disconnect();
  }, [observer])

  return (
    <div style={{ display: 'flex' }}>
      <Img
        state={state}
        onClick={() => {
          if (imgRef?.current) {
            imgRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }}
        src={src}
        ref={imgRef}
        id={id}
      />
      <InfoBox state={state}>
        <h1>{name}</h1>
        <h2>$ {usd}</h2>
      </InfoBox>
    </div>
  );
}

function App() {
  const [state, setState] = useState<Record<string, {state: string, cost: string, name: string}>>(imgs.reduce((acc, curr) => {
    return {...acc, [curr[0]]: {state: '', cost: curr[2], name: curr[1]} }
  }, {}));
  const fRef = useRef<HTMLDivElement>(null)
  const observer = useMemo<IntersectionObserver>(() => {
    return new IntersectionObserver(
      ents => ents.forEach(
        ent => {
          if (ent.isIntersecting) {
            setState(prev => ({...prev, [ent.target.id]: { ...prev[ent.target.id], state: 'foc'} }));
          }
          if (!ent.isIntersecting) {
            setState(prev => ({...prev, [ent.target.id]: { ...prev[ent.target.id], state: 'blr'}}));
          }
        }
      ),
      { root: document.querySelector("#view"), threshold: [0], rootMargin: '-40%' }
    );
  }, [fRef]);
  return (
    <>
    <Container id="view">
      <div style={{ padding: "15vw", width: '50vw', height: '300px', boxSizing: 'border-box' }} />
      {Object.keys(state).map((k: string) => {
        return <ObservedImg key={k} state={state[k].state} id={k} observer={observer} src={k} usd={state[k].cost} name={state[k].name} />
      })}
      <div style={{ padding: "15vw", width: '50vw', height: '300px', boxSizing: 'border-box' }} />
    </Container>
  </>
  )
}

export default App
