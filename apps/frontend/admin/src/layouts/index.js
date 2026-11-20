import React from 'react'
import PropTypes from 'prop-types'
import Redirect from 'umi/redirect'
import pathToRegexp from 'path-to-regexp'
import OpenPageLayout from './OpenPageLayout'
import AuthRequiredLayout from './AuthRequiredLayout'
import { isOpenPages } from '../helpers/env'

export default class Layout extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ pathname: PropTypes.string }),
    route: PropTypes.any,
    children: PropTypes.any
  }

  render() {
    const { location, route, children } = this.props

    if (isOpenPages(location.pathname)) {
      return <OpenPageLayout>{children}</OpenPageLayout>
    }
    if (checkIfPageExist(route, location)) {
      return <AuthRequiredLayout>{children}</AuthRequiredLayout>
    }
    return (
      <Redirect
        to={{
          pathname: '/o/404',
          search: `?from=${encodeURIComponent(location.pathname)}`
        }}
      />
    )
  }
}

const availableRouteMatcher = []

function checkIfPageExist(route, location) {
  if (!route || !route.routes) {
    return false
  }
  const { pathname } = location
  if (!availableRouteMatcher.length) {
    const routes = route.routes.map(r => r.path).filter(r => !!r)
    availableRouteMatcher.push(...routes.map(r => pathToRegexp(r)))
  }
  return availableRouteMatcher.some(m => m.exec(pathname))
}
