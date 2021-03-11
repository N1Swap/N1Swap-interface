import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/components/pagewrapper.module.less'

import { Layout, Menu, Breadcrumb, Button,Divider} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import {HomeOutline,SwitchHorizontal,LightningBoltOutline} from 'heroicons-react';

import ConnectWallet from 'components/header/connect'
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
            <div className='fullpage-container' >
                <Head>
                    <title>N1Swap</title>
                    <link rel="icon" href="/img/favicon.png" />
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
                      width={250}
                      onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                      }}
                      className="block-sider"
                    >   
                        <div className="block-sider-top">
                        <div className='block-logo'>
                            <Image
                                src="/img/logo/logo_square.png"
                                alt="N1Swap Logo"
                                width={32}
                                height={32}
                                className="logo"
                              />
                            <span className='word'>N1Swap</span>
                        </div>
                        <Menu theme="light" mode="inline" onClick={this.handleClick} selectedKeys={selectedKeys}>
                            <Menu.Item key="home" icon={<HomeOutline />}>
                              Home
                            </Menu.Item>
                            <Menu.Item key="exchange" icon={<SwitchHorizontal />}>
                              Exchange
                            </Menu.Item>
                            <Menu.Item key="liquidity" icon={<LightningBoltOutline />}>
                              Liquidity
                            </Menu.Item>
                        </Menu>
                        </div>

                        <div className={styles.block_sider_bottom}>

                            <div className={styles.block_social}>
                                <a>
                                    <Image src="/img/social/discord.svg" 
                                    width={24}
                                    height={24}/></a>
                                <a>
                                    <Image src="/img/social/twitter.svg" 
                                    width={24}
                                    height={24}/></a>
                                <a>
                                    <Image src="/img/social/telegram.svg" 
                                    width={24}
                                    height={24}/></a>
                            </div>

                            <Divider />
                            <div className={styles.block_lang}>
                                <LanguageBtn />
                            </div>
                        </div>

                    </Sider>
                    <Layout>

                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        
                        <div className="block-left-menu">
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                              className: 'trigger',
                              onClick: () => {
                                this.setCollapsed(!collapsed);
                              },
                            })}
                        </div>
                        <div className="block-right-menu">
                            <N1SBtn />
                            <ConnectWallet />
                            <MoreBtn />
                        </div>
                    </Header>

                      <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.children}
                        </div>
                      </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}


module.exports = withRouter(PageWrapper)
