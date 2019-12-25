import React, {useEffect, useState} from 'react'

import Moment from 'react-moment'
import SocketIO from 'socket.io-client' 

import api from '../../services/api'

import emailBckGround from "../../assets/images/email-png-images-transparent.png"
import "./adminMessages.css"

const socket = SocketIO(process.env.REACT_APP_API_SOCKET_URL)

export default function AdminMessages() { 
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('null')
  const [email, setEmail] = useState('null')
  const [date, setDate] = useState('null')
  const [message, setMessage] = useState('null')
  const [messageID, setMessageID] = useState('null')
  const [totalMessages, setTotalMessages] = useState(0)
  const [show, setShow] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function loadMessages () {
      const response = await api.get('./messages')
      setMessages(response.data)
      setTotalMessages(response.data.length)
      
    }
    loadMessages()
      document.title = `${totalMessages} messages`
     

    socket.on('connect', () => {
      console.log('connected to AdminMessage')
    })

    socket.on('refreshMessagesList', () => {
      console.log("a new message is received")
      setRefresh(!refresh)
    })

    socket.on('messageSaw', () => {
      setRefresh(!refresh)
    
      console.log('le message a été lu...')
    })

    socket.on('messageDeletedConfirmation', () => {
      setRefresh(!refresh)
      console.log('deleted confirmation')
    })
    
    return() => document.title = 'Savoureux Admin'
  },[refresh, show, totalMessages])

  //
  function handleMessage(message){
    setMessageID(message._id)
    setName(message.name)
    setEmail(message.email)
    setDate(message.date)
    setMessage(message.message)

    handleSaw(message)
    setRefresh(!refresh)
    console.log(message.name, message._id, 'saw: ',message.saw,'show: ',show, 'refresh: ', refresh)
  }

  //vérifie si le message etait dejà vu
  async function handleSaw (message) {
    if  ( message.saw === false ) {
      await api.put('/messages/'+message._id, 
        {saw: true}
      )
    }
    socket.emit('messageUpdated')
  }

  //Suprime le message selectioné
  async function handleDelete() {
    await api.delete('/messages/'+messageID)
    .then(() => {
      socket.emit('messageDeleted')
      console.log('message suprimée: ',messageID)
    })
    setRefresh(!refresh)
  }

  return (
    <div className="messagesContainer">
      <div className="messagesContent">
        <ul  id="menu" className="boiteMessages" >
            <h1>Boîte de réception {totalMessages}</h1>
            {messages
            .sort((a,b) => a.date > b.date)
            .map((message, ) =>  (
            
              <li className="sender" key={message._id} onClick={() => {setRefresh(!refresh); setShow(true);handleMessage(message) }}>
                {
                  message.saw 
                  ? (<p><span role="img" aria-label="email icon">📧</span>{message.name}  </p>)
                  :
                  ((<p><span role="img" aria-label="email icon">📧</span><strong>{message.name}</strong></p>))
                }
              </li> 
            ))}
          </ul>
        
        {
          show ? (
            <div className="showMessage">
              <div id="messageHeader">
                <p>{name} [{email}] - <Moment format="DD/MM/YYYY - HH:mm">{date}</Moment></p>
                <i id="trashIcon" className="fa fa-trash" 
                  onClick={() => { if (window.confirm('Voulez-vous effacer ce message definitivement?')){ handleDelete(); setShow(false)} }}/>
              </div>
              <p id="messageContent">{message} </p>
            </div>
          ) : 
          (
            <div className="showMessage">
              <div id="image">
              < img src= {emailBckGround} alt="email background" />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}