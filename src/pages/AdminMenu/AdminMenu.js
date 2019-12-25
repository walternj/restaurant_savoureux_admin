import React,{ useEffect, useState, useMemo} from 'react'

import api from '../../services/api'
import SocketIO from 'socket.io-client' 
 
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import {Modal, Button} from 'react-bootstrap'

import camera from '../../assets/images/camera.svg'
import './adminMenu.css'

const socket = SocketIO(process.env.REACT_APP_API_SOCKET_URL)

export default function AdminMenu() {
	const [plats, setPlats] = useState([])
	const [show, setShow] = useState(false)
	const [photo, setPhoto] =  useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [refresh, setRefresh] = useState(false)

  const preview = useMemo(() => {
    return photo ? URL.createObjectURL(photo) : null
  }, [photo])
  
  useEffect(() => {
    async function loadPlats () {
      const response = await api.get('./plats')
    
    setPlats(response.data)
    }
    loadPlats()

    socket.on('connect', () => {
      console.log('connected to AdminMenu')
      
    })

  },[refresh] )

  const handleShow = (event) => {
    event.preventDefault()
    setShow(true)
  };

  const handleClose = () => {
    setPhoto('')
    setTitle('')
    setDescription('')
    setPrice('')
    setShow(false)}

	async function handleSubmit () {

    const data = new FormData()
    data.append('photo', photo)
    data.append('title', title)
    data.append('description', description)
    data.append('price', price)

    try {
      await api.post('/plats', data)
      setPhoto('')
      setTitle('')
      setDescription('')
      setPrice('')

      socket.emit('menuPosted', () => {
        console.log('new menu posted..')
       
      })
      setRefresh(!refresh)
    }
    catch(err) {
      console.log(err)
    }
  }

/* async function handleDelete() {
    await api.delete('/messages/'+messageID)
    .then(() => {
      socket.emit('messageDeleted')
      console.log('message suprimée: ',messageID)
    })
    setRefresh(!refresh)
  } */

  async function handleDelete (plat) {
    try {
      await api.delete('/plats/'+plat._id)
      
    }
    catch(err) {
      console.log(err)
    }
  }

  const socketDelete = () => {
    socket.emit('menuDeleted', () => {
      console.log('menu deleted...')
    
    })
    setRefresh(!refresh)
    console.log('menu deleted...')
  }
  
  async function handleUpdate (plat) {
    await api.put('/plats/'+plat.plat_id)
    setRefresh(!refresh)
  }  
  
  return ( 
    <div className="menuContainer"> 
      <div className="cardDeckContainer">
        <p id="menuTitle">Gestion de Menus</p>
        <div id="menuFrame">
          <CardDeck bsPrefix="card-deck">
            {plats.map(plat => (
              <Card  bsPrefix="col-sm-10 col-md-4 col-lg-3" 
                id="card" key={plat._id}  
              >
              <Card.Img className="image" variant="top" src={plat.photo_url} alt={plat.title}/>
              <Card.Body>
                <Card.Title>{plat.title}</Card.Title>
                <Card.Text style={{marginBottom: 20, wordWrap: "break-word"}}>
                  {plat.description}
                  <i id="menuEditIcon" className="fa fa-edit" 
                    onClick={() => { handleUpdate(plat)}}
                  />
                    <i id="menuTrashIcon" className="fa fa-trash" 
                      onClick={() => {if (window.confirm('Voulez-vous effacer ce plat definitivement?')){handleDelete(plat); socketDelete()} }}
                    />
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <p className="text-muted">{plat.price}€</p>
                </Card.Footer>
              </Card>
            ))}
              <Card bsPrefix="col-sm-10 col-md-4 col-lg-3" 
                  id="card" onClick={handleShow}  >
                <Card.Img className="image" variant="top"  />
                <Card.Body>
                  <Card.Title>+ ajouter un titre</Card.Title>
                  <Card.Text>
                    + ajouter une description...
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <p className="text-muted">+ ajouter un prix €</p>
                </Card.Footer>
              </Card>
            </CardDeck>
          </div>
        </div>

				<Modal  id="modalWindow" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">Ajouter un nouveau plat</Modal.Title>
        </Modal.Header>
        <Modal.Body >
					<form >
            <label id="photo"
              style={{ backgroundImage: `url(${preview})`}}
              className={photo ? 'has-photo' : ''}
            >
              <input type="file" onChange={event => {setPhoto(event.target.files[0]); console.log(event.target.files[0]); console.log(event.target.files[0])}}
                 name="photo" placeholder="Photo du nouveau plat" />
              <img src={camera} alt="select" /> 
             
            </label>
            <label htmlFor= "title" >Titre</label>
              <input id="title" onChange={event => setTitle(event.target.value)} 
                value={title} type="text" name="nom" placeholder="Nom du nouveau plat"  
              />
            
            <label htmlFor="price">Prix </label>
              <input id="price" onChange={event => setPrice(event.target.value)} 
                value={price} type="text" name="prix" placeholder="Prix du nouveau plat"  
              />
           
            <label htmlFor="description">Description</label>
              <textarea id="description" onChange={event => setDescription(event.target.value)} 
                value={description} type="text" 
                name="description" 
                placeholder="Description du nouveau prix"  
              />
					</form>
				</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button id="confirmButton" variant="primary"  type="submit" onClick= {() => {handleSubmit(); handleClose(); } } >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
