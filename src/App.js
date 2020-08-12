import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Card, Col, Row, Select, Divider, Button } from 'antd';

const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  // const [pokemonDetail, setPokemonDetail] = useState(null);
  const [next, setNext] = useState(null);
  const prevPokemonList = usePrevious(pokemonList);


  const getData = () => {
    let url = new URL('https://pokeapi.co/api/v2/pokemon')
    if(next) {
      url = new URL(next);
    }

    return fetch(url)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData)
        setNext(() => responseData.next)
        setPokemonList(() => [...pokemonList, ...responseData.results]);
      })
  }


  useEffect(() => {
    getData()
  },[]);



  const constructImageUrl = (url) => {
    if (url) {
      let pokemonImgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

      const split = url
        .split('/')
        .filter((val) => Number(val))
        .toString();

      return `${pokemonImgUrl}${split}.png`;
    }

    return '';
  };

  const loadMore = () => getData();
  const handleChangeType = (value) => {
    console.log(value)
  }


  return (
    <div className="App">
      <Layout>
        <Header>
          <h1 className="logo">Pokédex</h1>
        </Header>
        <Content>
          <div className="content-box site-card-wrapper">
          <Select defaultValue="" style={{ width: 120 }} onChange={handleChangeType}>
            <Option value="">All Type</Option>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
            <Divider />
            <Row gutter={16}>
              { pokemonList
                ?.map((pokemon, i) =>
                  <Col className="cust-col" span={6} key={`poke-${i}`}>
                    <Card
                      hoverable
                      cover={<img alt="example" src={constructImageUrl(pokemon.url)} />}
                    >
                      <Meta title={pokemon.name} description="www.instagram.com" />
                    </Card>
                  </Col>
                )
              }
            </Row>
            <Button onClick={() => loadMore()} type="primary" size='large'>Load More</Button>
            <Divider />
          </div>
        </Content>
        <Footer>@MuhammadKurnia</Footer>
      </Layout>
    </div>
  );
}

export default App;
