import React from 'react'
import PropTypes from 'prop-types'

export default function OpenPageLayout({ children }) {
  return <div className="open-page-layout">{children}</div>
}

OpenPageLayout.propTypes = {
  children: PropTypes.any
}
