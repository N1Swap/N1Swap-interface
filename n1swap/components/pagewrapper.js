import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/components/pagewrapper.module.less'

import { Layout, Menu, Breadcrumb, Button,Divider, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import {LightningBoltIcon,HomeIcon,SwitchHorizontalIcon} from '@heroicons/react/outline';


import WalletConnectBtn from 'components/wallet/connectbtn'
import N1SBtn from 'components/header/n1s'
import LanguageBtn from 'components/language/btn'
import MoreBtn from 'components/header/more'

import Head from 'next/head'

import { withRouter } from 'next/router'

                            // <TelegramSvg />

class PageWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            collapsed : false
        }
        this.setCollapsed = this.setCollapsed.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    setCollapsed(collapsed) {
        this.setState({
            'collapsed' : collapsed
        })   
    }

    handleClick(key) {
        console.log('handleClick',key)
        let href;
        switch(key.key) {
            case 'exchange':
                href = '/exchange';
                break;
            case 'liquidity':
                href = '/liquidity';
                break;
            default:
                href = '/';
                break;

        }
        this.props.router.push(href)
    }

    getSelectKey(pathname) {


        switch(pathname) {
            case '/liquidity':
            case '/liquidity/add':
                return ['liquidity']
            case '/exchange':
                return ['exchange']
            default:
                return ['home']
        }
    }

    render() {

        const {collapsed} = this.state;
        const {router} = this.props;

        const selectedKeys = this.getSelectKey(router.pathname)
        return (
            <div>
                <Head>
                    <title>N1Swap</title>
                    <link rel="icon" href="/img/favicon.png" />
                </Head>




                <div className="fullpage-container">

                <div className="top-bg">
                <div className="max-width">
                    <Row gutter={{ xs: 8, sm: 16, md: 24}}>
                        <Col sm={24} lg={12}>
                            <div className="top-header-left">
                                <div className='block-logo'>
                                    <Image
                                            src="/img/logo/logo_square.png"
                                            alt="N1Swap Logo"
                                            width={28}
                                            height={28}
                                            className="logo"
                                          />
                                    <span className='word'>
                                    <Image
                                        src="/img/logo/word.svg"
                                        alt="N1Swap"
                                        width={93}
                                        height={22}
                                        className="logo"
                                      />
                                    </span>
                                </div>
                                <div className="top-nav">
                                    <a className="active">Swap</a>
                                    <a>Lending</a>
                                    <a>NFT</a>
                                    <a>Farms</a>
                                    <a>Pixelschain</a>
                                </div>

                            </div>
                        </Col>
                        <Col sm={24} lg={12}>

                            <div className="top-header-right">
                                <N1SBtn />
                                <WalletConnectBtn />
                                <MoreBtn />
                            </div>
                        </Col>
                    </Row>
                </div>
                </div>

                <div className="top-bg nav">
                <div className="max-width">
                    <Row gutter={{ xs: 8, sm: 16, md: 24}}>
                        <Col span={24}>
                            <div className="nav-menu">
                                <div className="one"><a href="/liquidity">Liquidity</a></div>
                                <div className="one"><a href="/exchange">Exchange</a></div>
                                <div className="one"><a>Analytics</a></div>
                                <div className="one"><a>Mine</a></div>
                                <div className="one"><a>Introduce</a></div>
                                <LanguageBtn />
                            </div>
                        </Col>
                    </Row>
                </div>
                </div>

                <Layout>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                </Layout>
            </div>
            </div>
        );
    }
}


module.exports = withRouter(PageWrapper)
