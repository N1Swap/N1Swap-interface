import '../styles/globals.css'

import {wrapper,makeStore} from '../redux/store';
import App, {Container} from "next/app";
// import {Provider} from "react-redux";

import Immutable from 'immutable';
import PageWrapper from '../components/pagewrapper'

// let store = initStore();

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

        return <Component {...pageProps} />
    }
}

export default wrapper.withRedux(MyApp)
