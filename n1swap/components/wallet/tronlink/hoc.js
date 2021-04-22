import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TranslateContext from 'helper/translate/context'
import {strFormat} from 'helper/str'

import {tronlink_installed,tronlink_logined,tronlink_set_account,tronlink_set_balance} from 'redux/reducer/setting';
import {set_balance,remove_balance_all} from 'redux/reducer/token'
import {getTronLinkLoginAccount,getIsInstalledTronLink,getTrxBalance} from 'helper/tron';
import {getBalanceList} from 'helper/tron_util';
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

            console.log('tronlink的账户状态',tronlink_account);

            if (tronlink_account && !tronlink.get('is_logined')) {
                this.props.tronlink_logined(true);
            }

            //如果原来就已经有登陆账户，这里检查的是是否退出了用户
            if (tronlink.get('account')) {
                if (!tronlink_account) {
                    console.log('突然发现账户不是登陆状态了');
                    this.props.tronlink_set_account(null);
                    // this.props.tronlink_set_balance(0);
                    this.props.remove_balance_all();
                }
            //如果原来不是登陆用户，这里需要检查的是用户是否突然登陆了
            }else {
                if (tronlink_account) {
                    console.log('突然发现账户是登陆状态了');

                    this.props.tronlink_set_account(tronlink_account);
                    // let trx_balance = await getTrxBalance(tronlink_account);
                    // this.props.tronlink_set_balance(trx_balance);

                    // let balance_list = await getBalanceList(tronlink_account);
                    let balance_list = await getBalanceList('TS9wJbdDASqdbXnhwPrkPVVm5GaFZKtCWo');

                    Object.keys(balance_list).map(k=>{
                        this.props.set_balance(k,balance_list[k])
                    })

                }
            }

        }


        render() {


            return <WrappedComponent 
                ref={instanceComponent => this.instanceComponent = instanceComponent}
                // {...this.props} 
                balance={this.props.balance}
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
            },
            'set_balance' : (token,data) => {
                return dispatch(set_balance({
                    'token'   : token,
                    'data'    : data
                }))
            },
            'remove_balance_all' : () => {
                return dispatch(remove_balance_all())
            }
         }
    }
    function mapStateToProps(state,ownProps) {
        return {
            'tronlink' : state.getIn(['setting','tronlink']),
            'balance'  : state.getIn(['token','balance'])
        }
    }

    return connect(mapStateToProps,mapDispatchToProps)(tronlinkComponent)

}

export default tronlinkHoc;