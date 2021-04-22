import React, { useState } from 'react';

import {wrapper} from '../redux/store';

import PageWrapper from '../components/pagewrapper'
import TradeBox from '../components/swap/trade'

import Head from 'next/head'


const Home = () => {

    return <PageWrapper>
            <Head>
                <title>Exchange</title>
            </Head>
            <div className="color-bg">
            <div className="max-width page-all">
                <TradeBox />
            </div>
            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
