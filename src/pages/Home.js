import React, { Component } from 'react'

import ThreeScene from 'components/ThreeScene'
import myScene from 'libs/myScene'

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.threeSceneRef = new React.createRef()
  }

  render = () => {
    const props = {}

    return (
      <ThreeScene
        ref={this.threeSceneRef}
        myScene={myScene}
        {...props}
      />
    )
  }
}

export default Layout