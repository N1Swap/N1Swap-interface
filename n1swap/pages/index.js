import React, { useState } from 'react';

import {wrapper} from '../redux/store';

import PageWrapper from '../components/pagewrapper'
import TradeBox from '../components/swap/trade'

import Head from 'next/head'

import {Button,message} from 'antd'
import {getTronWeb,Base58ToHex} from 'helper/tron'

const Home = () => {

    return <PageWrapper>
            <Head>
                <title>Home</title>
            </Head>
            <div>
                <h1>Home</h1>
            </div>
    </PageWrapper>
    
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
