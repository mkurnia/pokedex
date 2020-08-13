import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Card, Col, Row, Select, Divider, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonTypeList, setPokemonTypeList] = useState([]);
  // const [pokemonDetail, setPokemonDetail] = useState(null);
  const [next, setNext] = useState(null);


  const getListPokemon = (url) => fetch(new URL(url)).then(response => response.json());

  const getListPokemonByType = (url) => {
    setLoading(true)
    return fetch(new URL(url))
    .then(response => response.json())
    .then(responseData => {
      setPokemonList(() => responseData.pokemon.map(data => data.pokemon));
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const getPokemonTypes = () => fetch(new URL('https://pokeapi.co/api/v2/type'))
    .then(response => response.json())
    .then(responseData => {
      setPokemonTypeList(() => responseData.results);
    })


  const getListPokemenData = (url, { resetData = false } = {}) => {
    setLoading(true)
    return getListPokemon(url)
    .then(data => {
      if(resetData) {
        setPokemonList(() => data.results)
      } else {
        setPokemonList(() => [...pokemonList, ...data.results])
      }
      setNext(() => data.next);
    })
    .finally(() => {
      setLoading(false)
    })
  };

  useEffect(() => {
    getListPokemenData('https://pokeapi.co/api/v2/pokemon');
    getPokemonTypes();
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

  const loadMore = () => getListPokemenData(next);
  const handleChangeType = async (url) => {
    if(!url) {
      getListPokemenData('https://pokeapi.co/api/v2/pokemon', { resetData: true })
    } else {
      getListPokemonByType(url)
    }
  }


  return (
    <div className="App">
      <Layout>
        <Header>
          <h1 className="logo">Pokédex</h1>
        </Header>
        <Content>
          <div className="content-box site-card-wrapper">
            <div className="control">
              Select Pokemon Type:&nbsp;
              <Select defaultValue="" style={{ width: 120 }} onChange={(type) => handleChangeType(type)}>
                <Option value="">All Type</Option>
                { pokemonTypeList
                  ?.map((type, i) =>
                <Option value={type.url} key={`type-${i}`}>{type.name}</Option>
                  )
                }
              </Select>
            </div>
            <Divider />
            { loading ? <div className="loading"><LoadingOutlined /></div> : ''}
            <Row gutter={16} >
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
