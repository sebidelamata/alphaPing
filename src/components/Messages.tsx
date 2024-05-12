import React, 
{ 
    useEffect, 
    useState, 
    useRef, 
    MouseEventHandler
} from 'react'
import { io } from "socket.io-client"
import banana from '/Banana.svg'
import monkey from '/monkey.svg'
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING'


// Socket
const socket = io('ws://localhost:3030')

interface MessagesProps {
    account: string | null;
    messages: Message[];
    currentChannel: AlphaPING.ChannelStructOutput | null;
  }

const Messages:React.FC<MessagesProps> = ({ account, messages, currentChannel }) => {
  const [message, setMessage] = useState("")

  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage:MouseEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const messageObj = {
      channel: currentChannel?.id.toString(),
      account: account,
      text: message
    }

    if (message !== "") {
      socket.emit('new message', messageObj)
    }

    setMessage("")
  }

  const scrollHandler = () => {
    setTimeout(() => {
        if(messageEndRef.current){
            (messageEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, 500)
  }

  useEffect(() => {
    scrollHandler()
  })

  return (
    <div className="messages">
      <div className="messages-feed">

        {
        currentChannel && 
        messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className="message" key={index}>
            <div className='message-header'>
              <img src={monkey} alt="User Icon" className='monkey-icon'/>
            </div>
            <div className="message-content">
              <h3 className='message-poster-address'>
                {message.account.slice(0, 6) + '...' + message.account.slice(38, 42)}
              </h3>
              <p className='message-content-text'>
                {message.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={messageEndRef} />
      </div>
      <form onSubmit={sendMessage} className='message-submit-form'>
        {
          currentChannel && 
          account ? (
            <input 
              type="text" 
              value={message} 
              placeholder={`Message #${currentChannel.name}`} 
              onChange={(e) => setMessage(e.target.value)} 
              className='message-form-input'
            />
          ) : (
            <input 
              type="text" 
              value="" 
              placeholder={`Please Connect Wallet / Join the Channel`} 
              disabled 
              className='message-form-input disabled'
            />
          )
        }
        <button type="submit" className='message-form-submit-button'>
          <img src={banana} alt="Send Message" className='banana-send-icon'/>
        </button>
        <button type="button">
          Trade
        </button>
      </form>
    </div>
  );
}

export default Messages;