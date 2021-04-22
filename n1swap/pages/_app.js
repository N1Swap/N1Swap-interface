import {wrapper,makeStore} from '../redux/store';
import App, {Container} from "next/app";
import {Suspense} from 'react';

import TranslateProvider from 'helper/translate/provider'
import PageAll from 'components/pageall'

import Immutable from 'immutable';
import PageWrapper from '../components/pagewrapper'

require('../styles/globals.less');

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

        console.log('debug:this.props',this.props,wrapper);

        if (isServer) {
            return  <TranslateProvider><PageAll><Component {...pageProps} /></PageAll></TranslateProvider>
        }else {
            return <Suspense fallback={<h1>Loading translate data...</h1>}>
                <TranslateProvider>
                    <PageAll>
                    <Component {...pageProps} />
                    </PageAll>
                </TranslateProvider>
            </Suspense>
            // return <TranslateProvider><Component {...pageProps} /></TranslateProvider>
        }
        
    }
}

export default wrapper.withRedux(MyApp)
