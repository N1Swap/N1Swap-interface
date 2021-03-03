import React, { useState } from 'react';
import {useSelector} from 'react-redux';

import Image from 'next/image'
import Head from 'next/head'
import styles from '../styles/index.module.css'

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

import { UploadOutlined, UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import {wrapper} from '../redux/store';
import { useRouter } from 'next/router'

import Tron from '../components/tron'

// export const getStaticProps = wrapper.getStaticProps(
//     ({store, preview}) => {
//         console.log('2. Page.getStaticProps uses the store to dispatch things');
//         store.dispatch({type: 'TICK', payload: 'was set in other page ' + preview});
//     }
// );

// export const getServerSideProps = wrapper.getServerSideProps(
//     ({store, req, res, ...etc}) => {
//         console.log('2. Page.getServerSideProps uses the store to dispatch things');
//         store.dispatch({type: 'TICK', payload: 'was set in other page'});
//     }
// );


const Home = () => {

    const [collapsed, setCollapsed] = useState(false);

    const {tick} = useSelector(state => state);

    const router = useRouter();

    const handleClick = (key) => {
        console.log('handleClick',key)
        let href;
        switch(key.key) {
            case 'test':
                href = '/test';
                break;
            default:
                href = '/';
                break;

        }
        router.push(href)
    }



    console.log('debug-tick',tick)

    return (
        <div className={styles.container}>

            <Head>
                <title>N1Swap</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <Layout>
                <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={broken => {
                    console.log(broken);
                  }}
                  collapsed={collapsed}
                  theme={'light'}
                  onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                  }}
                >
                    <div className='block-logo'>
                        <Image
                            src="/img/logo/logo.png"
                            alt="N1Swap Logo"
                            width={38}
                            height={40}
                            className="logo"
                          />
                        <span className='word'>N1Swap</span>
                    </div>
                    <Menu theme="light" mode="inline" onClick={handleClick}>
                        <Menu.Item key="home" icon={<UserOutlined />}>
                          Home
                        </Menu.Item>
                        <Menu.Item key="trade" icon={<VideoCameraOutlined />}>
                          Trade
                        </Menu.Item>
                        <Menu.Item key="test" icon={<VideoCameraOutlined />}>
                          Test
                        </Menu.Item>

                    </Menu>
                </Sider>
                <Layout>

                  <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                      className: 'trigger',
                      onClick: () => {
                        setCollapsed(!collapsed);
                      },
                    })}

                    <Tron />
                  </Header>

                  <Content style={{ margin: '24px 16px 0' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    </div>
                  </Content>
                </Layout>
            </Layout>
        </div>
    )
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
