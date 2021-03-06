import React, { useState } from 'react';

import {wrapper} from '../redux/store';

import PageWrapper from '../components/pagewrapper'

import Head from 'next/head'

// export const getStaticProps = wrapper.getStaticProps(
//     ({store, preview}) => {
//         console.log('2. Page.getStaticProps uses the store to dispatch things');
//         store.dispatch({type: 'TICK', payload: 'was set in other page ' + preview});
//     }
// );

// export const getServerSideProps = wrapper.getServerSideProps(
//     ({store, req, res, ...etc}) => {
//         console.log('2. Page.getServerSideProps uses the store to dispatch things');
//         store.dispatch({type: 'TICK', payload: 'was set in other page'});
//     }
// );


const Home = () => {

    return <PageWrapper>
            <div>
            <Head>
                <title>Test</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <h1>TEST</h1>
            </div>
            </div>
    </PageWrapper>
}

// Home.getInitialProps = ({store, pathname, req, res}) => {
//     console.log('2. Page.getInitialProps uses the store to dispatch things');
//     store.dispatch({type: 'TICK', payload: 'was set in error page ' + pathname});
// };

export default Home;
