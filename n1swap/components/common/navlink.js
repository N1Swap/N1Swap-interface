import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'

const NavLink = ({ children, ...props }) => {

    const { asPath } = useRouter()
    const child = Children.only(children)
    const childClassName = child.props.className || ''
    const activeClassName = props.activeClassName || 'active';

    // pages/index.js will be matched via props.href
    // pages/about.js will be matched via props.href
    // pages/[slug].js will be matched via props.as

    //可以分成2种active的状态

    let is_match;

    if (props.matchstart === true) {

        is_match = (asPath.indexOf(props.href) == 0);

    }else {

        is_match = (asPath === props.href || asPath === props.as);


    }
    // console.log('is_match',is_match,asPath,props.href);


    const className = (is_match)
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName


    // console.log('className',className);
    // console.log('props',props);
    // console.log('href',props.href);

    return (
        <Link href={props.href}>
            <a className={className}>
              {React.cloneElement(child, {
                className: className || null,
              })}
            </a>
        </Link>
    )
}

NavLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

NavLink.defaultProps = {
  /* 上方校验 test 必须传递
   * 当它让在未填写的时候给它一个默认值就可以设置默认值
   */
  activeClassName: 'active',
  href           : ''
}


export default NavLink