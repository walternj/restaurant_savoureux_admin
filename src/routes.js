import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import AdminMenuBar from './components/AdminMenuBar'
import AdminReservations from './pages/AdminReservations/AdminReservations'
import AdminMessages from './pages/AdminMessages/AdminMessages'
import AdminMenu from './pages/AdminMenu/AdminMenu'
import AdminPlatsPopulaires from './pages/AdminPlatsPopulaires/AdminPlatsPopulaires'

export const AdminRoutes = () => {
    return (
      <BrowserRouter >
          <AdminMenuBar />
        <Switch>
          <Route exact path="/" component={AdminMessages} />
          <Route path="/adminReservations" component={AdminReservations} />
          <Route path="/adminMessages" component={AdminMessages} />
          <Route path="/adminMenu" component={AdminMenu} />
          <Route path="/adminPlatsPopulaires" component={AdminPlatsPopulaires} />
        </Switch>
      </BrowserRouter>
    )
  }

