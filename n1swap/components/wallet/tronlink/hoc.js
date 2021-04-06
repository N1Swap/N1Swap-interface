import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TranslateContext from 'helper/translate/context'
import {strFormat} from 'helper/str'

import {tronlink_installed,tronlink_logined,tronlink_set_account,tronlink_set_balance} from 'redux/reducer/setting';
import {getTronLinkLoginAccount,getIsInstalledTronLink,getTrxBalance} from 'helper/tron';
import { connect } from "react-redux";
import {pageReady} from 'helper/misc';

const tronlinkHoc = WrappedComponent => {

    class tronlinkComponent extends Component {

        static contextType = TranslateContext;

        constructor(props, context) {
            super(props, context);

            this.state = {
                'is_checking' : false
            }
            this.checkTronLink = this.checkTronLink.bind(this)
        }

        /*定时检查是否有钱包的数据，暂定是5秒检查一次，因此这里的代码需要考虑尽量的精简*/
        async checkTronLink() {

            const {tronlink} = this.props;

            let tronlink_account = getTronLinkLoginAccount();

            if (tronlink_account && !tronlink.get('is_logined')) {
                this.props.tronlink_logined(is_logined);
            }

            //如果原来就已经有登陆账户，这里检查的是是否退出了用户
            if (tronlink.get('account')) {
                if (!tronlink_account) {
                    console.log('突然发现账户不是登陆状态了');
                    this.props.tronlink_set_account(null);
                    this.props.tronlink_set_balance(0);
                }
            //如果原来不是登陆用户，这里需要检查的是用户是否突然登陆了
            }else {
                if (tronlink_account) {
                    console.log('突然发现账户是登陆状态了');

                    let trx_balance = await getTrxBalance(tronlink_account);

                    console.log('tronlink_account',tronlink_account);
                    this.props.tronlink_set_account(tronlink_account);
                    this.props.tronlink_set_balance(trx_balance);
                }
            }

        }


        render() {


            return <WrappedComponent 
                ref={instanceComponent => this.instanceComponent = instanceComponent}
                // {...this.props} 
                tronlink={this.props.tronlink}
                checkTronLink={this.checkTronLink}
                />
        }
    }


    const mapDispatchToProps = (dispatch) => {
         return {
            'tronlink_installed' : (is_installed) => {
                return dispatch(tronlink_installed(is_installed))
            },
            'tronlink_logined'   : (is_logined) => {
                return dispatch(tronlink_logined(is_logined))
            },
            'tronlink_set_account'   : (account) => {
                return dispatch(tronlink_set_account(account))
            },
            'tronlink_set_balance' : (balance) => {
                return dispatch(tronlink_set_balance(balance))
            }
         }
    }
    function mapStateToProps(state,ownProps) {
        return {
            'tronlink' : state.getIn(['setting','tronlink']),
        }
    }

    return connect(mapStateToProps,mapDispatchToProps)(tronlinkComponent)

}

export default tronlinkHoc;