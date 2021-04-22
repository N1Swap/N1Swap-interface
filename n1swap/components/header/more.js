import React from 'react';
import {Button,Popover} from 'antd';

import styles from 'styles/components/header/more.module.less'
import {ChevronRightIcon,DotsHorizontalIcon} from '@heroicons/react/solid';

class More extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   

    render() {

        let content = <div className="dropdown-menu">
            <ul>
                <li><a className="with-arrow">Github<ChevronRightIcon className={'icon-16'}/></a></li>
                <li><a className="with-arrow">WhitePaper<ChevronRightIcon className={'icon-16'}/></a></li>
            </ul>
        </div>

        return (
            <Popover placement="bottomRight" title={null} content={content} trigger="click">

                <Button
                    type="primary"
                    className={styles.more_btn}
                >
                    <DotsHorizontalIcon className={'icon-24'}/>
                </Button>

            </Popover>
        );
    }
}
module.exports = More
