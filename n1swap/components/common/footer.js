import React from 'react'
import {Layout,Col} from 'antd'
const { Footer } = Layout;
import Row from 'components/common/row'
import Image from 'next/image'
import LanguageBtn from 'components/language/btn'

export default class N1Footer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
          <Footer>
              <div className="max-width">
                  <Row>
                      <Col span={12}>
                          <div className="f1"><Image
                              src="/img/logo/word_white.svg"
                              alt="N1Swap"
                              width={54}
                              height={16}
                              className="logo"
                            /></div>
                          <div className="f2">©2021 N1Swap.com</div>
                      </Col>
                      <Col span={12}>
                          <div className="flex-end">
                            <LanguageBtn ghost />
                          </div>
                      </Col>
                  </Row>
              </div>
          </Footer>
        );
    }
}
