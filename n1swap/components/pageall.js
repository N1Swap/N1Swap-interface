import React from 'react';
import { connect } from "react-redux";

// import Image from 'next/image'
// import styles from '../styles/components/pagewrapper.module.less'

// import { Layout, Menu, Breadcrumb, Button,Divider, Col } from 'antd';
// const { Header, Content, Sider } = Layout;
// import { UserOutlined, VideoCameraOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

// import NavLink from 'components/common/navlink'

// import {LightningBoltIcon,HomeIcon,SwitchHorizontalIcon} from '@heroicons/react/outline';

// import Row from 'components/common/row'

// import WalletConnectBtn from 'components/wallet/connectbtn'
// import N1SBtn from 'components/header/n1s'
// import LanguageBtn from 'components/language/btn'
// import MoreBtn from 'components/header/more'

// import Footer from 'components/common/footer'

// import Head from 'next/head'

// import { withRouter,useRouter } from 'next/router'

// import {setSource} from 'helper/cookie'
// import {t} from 'helper/translate'

class PageAll extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            'account' : ''
        }
        this.loadBalance = ::this.loadBalance
    }

    componentDidMount() {
        console.log('debug,page all did mount')
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.tronlink.get('account') != prevState.account) {
            return {
                'account' : nextProps.tronlink.get('account')
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.account != prevState.account) {
            console.log('debug,监控到account改变')
            this.loadBalance(this.state.account)
        }
    }

    loadBalance() {
        console.log('执行了load_balance')
    }

    render() {

        return (
            <div>{this.props.children}</div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
     return {
     }
}
function mapStateToProps(state,ownProps) {
    return {
        'token' : state.getIn(['token']),
        'tronlink' : state.getIn(['setting','tronlink'])
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(PageAll)
