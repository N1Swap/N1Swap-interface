import React from 'react'

// require('~/css/common/loader.css');

export default class Loading extends React.Component {

  constructor(props) {
        super(props);
    }

    render() {

        var {theme} = this.props;

        if (!theme) {
            theme = 'dark'
        }

        return (
          <div className={"loader loader-active " + theme}>
            <div className="loader-inner line-scale-pulse-out">
              <div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
        );
    }
}
