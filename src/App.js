import React from 'react'

import {AdminRoutes} from './routes'
import {VerticleButton as ScrollUpButton} from 'react-scroll-up-button'

export default function Admin() {
  return (
    <div id="app" className="App">
      <AdminRoutes />
      <ScrollUpButton  AnimationDuration={1000}  />
    </div>
  )
}
