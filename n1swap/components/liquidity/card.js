import React,{useRef} from 'react';
import { withRouter } from 'next/router'
import classNames from "classnames";
import Image from 'next/image'
import Link from 'next/link'
import { connect } from "react-redux";

import Loading from 'components/common/loading'

import {Button} from 'antd';

import styles from 'styles/components/liquidity/card.module.less'

import {t} from 'helper/translate'
import {getLiquidity} from 'helper/contract';
import {percentDecimal,autoDecimal} from 'helper/number'
import {get_pool_by_token} from 'redux/reducer/liquidity'
import {getLpToken,getPool} from 'helper/state'

class LiquidityCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'token1' : props.token1,
            'token2' : props.token2,
            'is_fetched'   : false,
            'is_fetching'  : false
        }
        this.fetchPool = ::this.fetchPool
    }   

    static getDerivedStateFromProps(nextProps, prevState) {

        let new_state = {};
        let change = 0;
        if (nextProps.token1 != prevState.token1) {
            new_state['token1'] = nextProps.token1
            change = 1;
        }
        if (nextProps.token2 != prevState.token2) {
            new_state['token2'] = nextProps.token2
            change = 1
        }
        if (change == 1) {
            return new_state;
        }else {
            return null;
        }

    }

    componentDidMount() {
        this.fetchPool();
    }

    componentDidUpdate(prevProps, prevState) {

        // console.log('T9,componentDidUpdate',{'token1':prevState.token1,'token2':prevState.token2},{'token1':this.state.token1,'token2':this.state.token2})
        if (
          this.state.token1 != prevState.token1  
          || this.state.token2 != prevState.token2 
        ) {
            this.fetchPool();
        }
      }


    async fetchPool() {
        const {token1,token2} = this.props;

        if (token1 && token2) {
            // console.log('T9,准备去查找流动性',token1,token2);

            this.setState({'is_fetching':true})

            // let result = await getLiquidity(token1,token2);
            let result = await this.props.get_pool_by_token(token1,token2)
            // console.log('T9,查找流动的结果是',result);

            this.setState({
                'is_fetching': false,
                'is_fetched' : true,
            })

        }
    }


    render() {

        const {lp_token,token1,token2,bg,pool} = this.props;
        const {is_fetching,is_fetched} = this.state;

        // console.log('T9,debug-card',this.state)

        let cn = classNames(styles.liquidity_card);
        if (bg  == 'white') {
            cn = classNames(styles.liquidity_card,styles.white);
        }

        let total_lp_token = pool.get('total_lp_token');
        let token1_amount = pool.get('token1_amount');
        let token2_amount = pool.get('token2_amount');

        return (
            <div className={cn}>
               <div className={styles.p1}>
                    <div className={styles.l}>
                        <div className={styles.icons}>
                            <div className={classNames('icon-img',styles.iconone,styles.icon1)}>
                            <Image
                                src={"/img/token/"+token1.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                            <div className={classNames('icon-img',styles.iconone,styles.icon2)}>
                            <Image
                                src={"/img/token/"+token2.icon}
                                width={24}
                                height={24}
                                layout="fixed"
                            />
                            </div>
                        </div>
                        <div className={styles.name}>
                            <span className="upper">{token1.name}</span>
                            {' / '}
                            <span className="upper">{token2.name}</span>
                        </div>
                    </div>
                    <div className={styles.r}>{lp_token}</div>
               </div>

               <div className={styles.p2}>
                    {
                        (is_fetching && !total_lp_token)
                        ? <div className={styles.center}>loading</div>
                        : null
                    }
                    {
                        (is_fetched)
                        ? <React.Fragment>
                            <dl>
                                <dt>{t('your pool share')}</dt>
                                <dd>{
                                    (total_lp_token)
                                    ? percentDecimal(lp_token/total_lp_token) + '%'
                                    : '-'
                                }</dd>
                            </dl>
                            <dl>
                                <dt><span className="upper">{token1.name}</span></dt>
                                <dd>{autoDecimal(lp_token*token1_amount/total_lp_token)}</dd>
                            </dl>
                            <dl>
                                <dt><span className="upper">{token2.name}</span></dt>
                                <dd>{autoDecimal(lp_token*token2_amount/total_lp_token)}</dd>
                            </dl>
                        </React.Fragment>
                        : null
                    }
                    
               </div>
               <div className={styles.p3}>
                    <Link href={"/liquidity/remove/"+token1.contract_address+"/"+token2.contract_address}>
                        <Button ghost size="small" type="primary"  className="round-btn">manage</Button>
                    </Link>
               </div>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        get_pool_by_token: get_pool_by_token(dispatch),
    }
}
function mapStateToProps(state,ownProps) {
    return {
        'account'  : state.getIn(['setting','tronlink','account']),
        'lp_token' : getLpToken(state,ownProps.token1.contract_address,ownProps.token2.contract_address),
        'pool'     : getPool(state,ownProps.token1.contract_address,ownProps.token2.contract_address),
    }
}
module.exports = withRouter(connect(mapStateToProps,mapDispatchToProps)(LiquidityCard))


