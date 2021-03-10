require('../styles/globals.less');

import {wrapper,makeStore} from '../redux/store';
import App, {Container} from "next/app";
import {Suspense} from 'react';

import TranslateProvider from 'helper/translate/provider'

import Immutable from 'immutable';
import PageWrapper from '../components/pagewrapper'


class MyApp extends App {
    
    static getInitialProps = async ({Component, ctx}) => {
        return {
            pageProps: {
                // Call page-level getInitialProps
                ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
                // Some custom thing for all pages
                pathname: ctx.pathname,
            },
        };

    };

    render() {
        const {Component, pageProps} = this.props;

        const isServer = (typeof window === 'undefined');

        console.log('isServer',isServer);

        if (isServer) {
            return  <TranslateProvider><Component {...pageProps} /></TranslateProvider>
        }else {
            return <Suspense fallback={<h1>Loading translate data...</h1>}>
                <TranslateProvider>
                    <Component {...pageProps} />
                </TranslateProvider>
            </Suspense>
            // return <TranslateProvider><Component {...pageProps} /></TranslateProvider>
        }
        
    }
}

export default wrapper.withRedux(MyApp)
