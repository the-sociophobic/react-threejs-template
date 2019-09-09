import React, { Component } from 'react'
import Helmet from 'react-helmet'

import './config'

export default class extends Component {
  render = () => (
    <Helmet>
      <meta http-equiv="cache-control" content="max-age=0" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="-1" />
      <meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT" />
      <meta http-equiv="pragma" content="no-cache" />
    </Helmet>
  )
}