import React, { useState } from 'react';

import {wrapper} from 'redux/store';

import PageWrapper from 'components/pagewrapper'
import TradeBox from 'components/liquidity/add'

import Head from 'next/head'


const Home = () => {

    return <PageWrapper>
            <Head>
                <title>Home</title>
            </Head>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <TradeBox />
            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
