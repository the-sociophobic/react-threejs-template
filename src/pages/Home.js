import React, { Component, Fragment } from 'react'

import ThreeScene from 'components/ThreeScene'
import myScene from 'libs/myScene'

import skybox from 'img/test.png'
import prism from 'img/NormalMap.png'
import mainImage from 'img/grad.png'


class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      generated: false,
    }

    this.threeSceneRef = new React.createRef()
  }

  render = () => {
    const props = {}

    return (
      <Fragment>
        <img id="skybox" src={skybox} />
        <img id="prism" src={prism} />
        <img id="main-image" src={mainImage} />
        {this.state.generated ?
          <ThreeScene
            ref={this.threeSceneRef}
            myScene={myScene}
            {...props}
          />
          :
          <button onClick={() => this.setState({generated: true})}>
            generate
          </button>
        }
      </Fragment>
    )
  }
}

export default Layout