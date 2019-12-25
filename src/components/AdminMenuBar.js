import React from 'react'
import { Link } from 'react-router-dom'

import './adminMenuBar.css'

export default function AdminMenuBar() {
    return (
        <div className="menuBarContainer">
            <div className="menuBarContent">
                <div className="logo">
                    <p>Savoureaux!</p>
                    <p>Espace Administrateur</p>
                </div>
                <div className="menu">  
                    <ul>
                        <Link to="/adminReservations">
                            <li > Réservations </li>
                        </Link>
                        <Link to="/adminMessages">
                            <li>Messagerie</li>
                        </Link>
                        <Link to="/adminMenu">
                            <li>Menu</li>
                        </Link>
                        <Link to="/adminPlatsPopulaires">  
                            <li>Plats Populaires</li>
                        </Link>
                    </ul>
                </div>
            </div>
        
        </div>
    )
}
    