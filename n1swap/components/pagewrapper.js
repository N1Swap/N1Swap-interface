import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/components/pagewrapper.module.less'

import { Layout, Menu, Breadcrumb, Button,Divider} from 'antd';
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
                <div className='fullpage-container'>
                    <div className="top-header">
                        <a>Lending</a>
                        <a>Swap</a>
                        <a>NFT</a>
                        <a>Farms</a>
                        <a>Pixelschain</a>
                    </div>
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
                        <Menu theme="light" mode="inline" onClick={this.handleClick} selectedKeys={selectedKeys}>
                            <Menu.Item key="home" icon={<HomeIcon className='icon-24' />}>
                              Home
                            </Menu.Item>
                            <Menu.Item key="exchange" icon={<SwitchHorizontalIcon className='icon-24' />}>
                              Exchange
                            </Menu.Item>
                            <Menu.Item key="liquidity" icon={<LightningBoltIcon className='icon-24' />}>
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
                            <WalletConnectBtn />
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
            </div>
        );
    }
}


module.exports = withRouter(PageWrapper)
