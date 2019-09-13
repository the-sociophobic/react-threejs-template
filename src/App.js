import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import routes from './routes'

import Helmet from 'components/Helmet'

import 'styles/default.sass'
import 'styles/modificators.sass'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="content">
          <Router>
            <Helmet />
            <Switch>
              {routes.map(route =>
                <Route {...route} key={route.path} />
              )}
            </Switch>
          </Router>
        </div>
      </div>
    )
  }
}

export default App
