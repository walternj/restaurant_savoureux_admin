import React, {useEffect, useState} from 'react';

import api from '../../services/api'
import './AdminPlatsPopulaires.css'

export default function AdminPlatsPopulaires() {
	const [plats, setPlats] = useState([])

	useEffect(() => {
		async function loadPlats () {
			const response = await api.get('./plats')

			setPlats(response.data)
		}
		loadPlats()
	},[])

  return (
    <div className="platsContainer">
			<div className= "platsContent"> 
				<p id="platTitle">Gestion des Plats Populaires</p>
				<div className="platsList">
					<ul>
						{plats.map( plat => (
							<li key={plat.id}>
								<div className="image">
									<img src={plat.photo_url} alt={plat.title} />
									<div className="header">
										<p><strong>Titre:</strong> {plat.title}</p>
										<p><strong>Prix:</strong> {plat.price}€</p>
										<p><strong>Description:</strong> {plat.description}</p>
									</div>
								</div>
							</li>
						))}
						<li>			
							<img alt='ajouter plat'/>
						</li>
					</ul>
				</div>
			</div>    
    </div> 
  );
}
