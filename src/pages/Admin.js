import React from 'react'

import {AdminRoutes} from '../../routes'
import AdminSideMenu from './components/AdminMenuBar'

import './admin.css'

export default function Admin() {
  return (
    <div className="containerAdmin">
      <AdminSideMenu />
      <AdminRoutes />
    </div>
  )
}
