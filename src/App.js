import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Card, Col, Row, Select, Divider, Button, Modal, Progress, Tag, Descriptions } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonTypeList, setPokemonTypeList] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState({});
  const [pokeDetailUrl, setPokeDetailUrl] = useState(false);
  const [next, setNext] = useState(null);
  const [showDetail, setShowDetail] = useState(false);


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

  const getPokemonDetail = (url) => {
    setLoading(true)
    return fetch(new URL(url))
    .then(response => response.json())
    .then(responseData => {
      setPokemonDetail(() => responseData);
    })
    .finally(() => {
      setLoading(false)
    })
  }


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
      let pokemonImgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/';
      const split = url
        .split('/')
        .filter((val) => Number(val))
        .toString();
      return `${pokemonImgUrl}${split}.svg`;
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
  const modalDetailOpen = (pokeData) => {
    if(!loading) {setShowDetail(true)}
    setPokeDetailUrl(pokeData.url)
    getPokemonDetail(pokeData.url);
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
                      cover={<img alt="example" src={constructImageUrl(pokemon.url)} height="200" />}
                      onClick={() => modalDetailOpen(pokemon)}
                    >
                      <Meta title={pokemon.name} description="See Detail" />
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

        <Modal
          visible={showDetail}
          onCancel={() => setShowDetail(false)}
          footer={null}
          width="100%"
          style={{height: '100%', top: 0, padding: 0}}
        >
          <Row gutter={16}>
            <Col span={24} className="align-center"><h1 style={{fontSize: 40}}>{pokemonDetail.name} #{pokemonDetail.order}</h1></Col>
            <Col className="poke-information" span={12}>
              <img alt="example" src={constructImageUrl(pokeDetailUrl)} width="200" height="200"/>
            </Col>
            <Col className="poke-detail" span={12}>
              <Descriptions>
                <Descriptions.Item span={3} label="Types">
                  <span>
                    { pokemonDetail.types
                      ?.map((pokemonTypes, i) =>
                        <Tag className={`ant-tag-has-color type-${pokemonTypes.type.name}`} key={`pokeType-${i}`}>{pokemonTypes.type.name}</Tag>
                      )
                    }
                  </span>
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Experience">{pokemonDetail.base_experience}</Descriptions.Item>
                <Descriptions.Item span={3} label="Height">{pokemonDetail.height} ft</Descriptions.Item>
                <Descriptions.Item span={3} label="Weight">{pokemonDetail.weight} Kg</Descriptions.Item>
                <Descriptions.Item span={3} label="Abilities">
                  { pokemonDetail.abilities
                    ?.map((pokemonAby, i) =>
                      <span className="small-divider">{pokemonAby.ability.name}</span>
                    )
                  }
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={16} offset={4}><Divider /></Col>
          </Row>
          <Row>
            <Col span={8} offset={4} style={{paddingRight: 20}}>
              <Descriptions title="Moves">
                { pokemonDetail.moves
                  ?.map((pokemonMoves, i) =>
                    <Descriptions.Item span={1} key={`pokeMoves-${i}`}><span className="list-style">{pokemonMoves.move.name}</span></Descriptions.Item>
                  )
                }
              </Descriptions>
            </Col>
            <Col span={8} style={{paddingLeft: 20}}>
              <Descriptions title="Base stats:"></Descriptions>
              <ul className="list-progress">
                { pokemonDetail.stats
                  ?.map((pokemonStats, i) =>
                    <li key={`pokeStats-${i}`}>
                      <Row>
                        <Col span={8} style={{textTransform: 'capitalize', marginBottom: 10}}>{pokemonStats.stat.name}</Col>
                        <Col span={16}>
                          <Progress
                            strokeColor={{
                              from: '#4CAF50',
                              to: '#e91e1e',
                            }}
                            percent={pokemonStats.base_stat}
                            status="active"
                          />
                        </Col>
                      </Row>
                    </li>
                  )
                }
              </ul>
            </Col>
          </Row>
        </Modal>
      </Layout>
    </div>
  );
}

export default App;
