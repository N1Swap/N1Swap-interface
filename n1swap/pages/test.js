import React from "react";
import {connect} from "react-redux";

const Page = ({foo, custom}) => (
    <div>
        <div>Prop from Redux {foo}</div>
        <div>Prop from getInitialProps {custom}</div>
    </div>
);

// No need to wrap pages if App was wrapped
Page.getInitialProps = ({store, pathname, query}) => {
    store.dispatch({type: 'FOO', payload: 'foo'}); // The component can read from the store's state when rendered
    return {custom: 'custom'}; // You can pass some custom props to the component from here
}

export default connect((state) => state)(Page);