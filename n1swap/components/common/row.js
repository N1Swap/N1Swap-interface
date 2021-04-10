import React from 'react'
import {Row} from 'antd'

export default class N1Row extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
          <Row gutter={{ xs: 8, sm: 16, md: 24}}>
          {this.props.children}
          </Row>
        );
    }
}
