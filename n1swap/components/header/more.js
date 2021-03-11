import React from 'react';
import {Button,Popover} from 'antd';

import styles from 'styles/components/header/more.module.less'
import {DotsHorizontal,ChevronRight} from 'heroicons-react'

class More extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   



    render() {

        let content = <div className="dropdown-menu">
            <ul>
                <li><a className="with-arrow">Github<ChevronRight size={16}/></a></li>
                <li><a className="with-arrow">WhitePaper<ChevronRight size={16}/></a></li>
            </ul>
        </div>

        return (
            <Popover placement="bottomRight" title={null} content={content} trigger="click">

                <Button
                    className={styles.more_btn}
                >
                    <DotsHorizontal size={24}/>
                </Button>

            </Popover>
        );
    }
}
module.exports = More
