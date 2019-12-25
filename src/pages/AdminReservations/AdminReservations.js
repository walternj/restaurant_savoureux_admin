import React, {useState, useEffect} from 'react'

import api from '../../services/api'
import Moment from 'react-moment'
import './adminReservations.css'

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [today] = useState(toString(new Date()))
  
  useEffect(() => {
    async function loadReservations () {
      const response = await api.get('./reservations')
      
      setReservations(response.data)
      }
      loadReservations()
  },[])

  return (
    <div className="reservationsContainer"> 
      <div className="reservationsContent">
        <p id="titleReservation">Total de réservations: {reservations.length}</p>
        <ul>
          {reservations.map(reservation => (
            <li key={reservation._id}>
              <p><strong>Nom: </strong>{reservation.name}</p>
              <p><strong>Email: </strong> {reservation.email}</p>
              <p><strong>Qte de Personnes: </strong> {reservation.people}</p>
              <p className={(reservation.date > today) ? 'dateOk' : null}>
                <strong>Date: </strong>
                <Moment locale="fr" format="ddd - DD/MM/YYYY">{reservation.date}</Moment>
              </p>
              <p><strong>Heures: </strong> {reservation.time}</p> 
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}