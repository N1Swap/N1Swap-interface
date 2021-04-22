import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/components/pagewrapper.module.less'

import { Layout, Menu, Breadcrumb, Button,Divider, Col } from 'antd';
const { Header, Content, Sider } = Layout;
import { UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import NavLink from 'components/common/navlink'

import {LightningBoltIcon,HomeIcon,SwitchHorizontalIcon} from '@heroicons/react/outline';

import Row from 'components/common/row'

import WalletConnectBtn from 'components/wallet/connectbtn'
import N1SBtn from 'components/header/n1s'
import LanguageBtn from 'components/language/btn'
import MoreBtn from 'components/header/more'

import Footer from 'components/common/footer'

import Head from 'next/head'

import { withRouter,useRouter } from 'next/router'

import {setSource} from 'helper/cookie'
import {t} from 'helper/translate'

class PageWrapper extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            collapsed : false
        }
        this.setCollapsed = ::this.setCollapsed
        this.handleClick = ::this.handleClick
        this.handleReffer = ::this.handleReffer
    }

    componentDidMount() {
        this.handleReffer();
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

    handleReffer() {
        const {router} = this.props;
        const {f} = router.query;
        console.log('来源是',f);
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

                <div className="top-bg headnav nav-shadow-light">
                <div className="max-width">
                    <Row>
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
                                    <a className="active">{t('Swap')}</a>
                                    <a>{t('Lending')}</a>
                                    <a>{'NFT'}</a>
                                    <a>{t('Farms')}</a>
                                    <a>{'Pixelschain'}</a>
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

                <div className="top-bg nav  nav-shadow">
                <div className="max-width">
                    <Row>
                        <Col span={24}>
                            <div className="nav-menu">
                                <div className="one"><NavLink href="/">{t('Home')}</NavLink></div>
                                <div className="one"><NavLink href="/exchange" matchstart>{t('Swap')}</NavLink></div>
                                <div className="one"><NavLink href="/liquidity" matchstart>{t('Liquidity')}</NavLink></div>
                                <div className="one"><NavLink href="/status" matchstart>{t('Status')}</NavLink></div>
                                <div className="one"><NavLink href="/protfolio" matchstart>{t('portfolio')}</NavLink></div>
                            </div>
                        </Col>
                    </Row>
                </div>
                </div>

                <Layout>
                    <Content>
                        <div className="site-layout-background">
                            {this.props.children}
                        </div>
                    </Content>
                </Layout>

                <Footer />
            </div>
            </div>
        );
    }
}


module.exports = withRouter(PageWrapper)
