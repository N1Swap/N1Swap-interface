import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/index.module.css'

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { UploadOutlined, UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import Tron from 'components/tron'
import N1SBtn from 'components/n1s/btn'
import { withRouter } from 'next/router'


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
            case 'test':
                href = '/test';
                break;
            default:
                href = '/';
                break;

        }
        this.props.router.push(href)
    }

    render() {

        const {collapsed} = this.state;

        return (
            <div className={styles.container}>

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
                        <Menu theme="light" mode="inline" onClick={this.handleClick}>
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
                            <Tron />
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
