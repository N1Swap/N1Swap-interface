import React, { useState } from 'react';

import {wrapper} from 'redux/store';

import PageWrapper from 'components/pagewrapper'
import TradeBox from 'components/liquidity/overall'

import Head from 'next/head'

import {Fire,ArrowCircleRight} from 'heroicons-react'

const Home = () => {

    return <PageWrapper>
            <Head>
                <title>Home</title>
            </Head>



            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

                <div className="color-box margin-bottom-20">
                    <div className="head">
                        <div className="icon"><Fire size={16} /></div>
                        <div className="title">Liquidity provider rewards</div>
                    </div>
                    <div className="content">
                        Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
                    </div>
                    <div className="bottom">
                        <a className="with-end-icon">
                            <span>Read more about providing liquidity</span>
                            <div className="icon">
                                <ArrowCircleRight size={16} />
                            </div>
                        </a>
                    </div>
                </div>


                <TradeBox />
            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
