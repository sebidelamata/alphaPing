import React, {
    useState, 
    useEffect
} from "react"
import monkey from '/monkey.svg'
import { DateTime } from 'luxon';
import { ethers } from 'ethers'
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../contexts/ProviderContext'
import MessageHoverOptions from "./MessageHoverOptions";

interface MessageProps {
    message: Message;
    index: number;
    tokenDecimals: number | null;
    tokenAddress: string | null;
    setReplyId: React.Dispatch<React.SetStateAction<number | null>>;
    reply: Message | null;
    profilePic: string | null;
    profilePicsLoading: boolean;
    username: string | null;
    usernameArrayLoading: boolean;
}

const Message: React.FC<MessageProps> = ({
  message, 
  index, 
  tokenDecimals, 
  tokenAddress, 
  setReplyId, 
  reply, 
  profilePic,
  profilePicsLoading,
  username,
  usernameArrayLoading
}) => {
    const { signer } = useEtherProviderContext()

    const [userBalance, setUserBalance] = useState<string | null>(null)
    const [hoverOptions, sethoverOptions] = useState<boolean>(false)
    const [hoverReactions, sethoverReactions] = useState<string | null>(null)

    const getUserBalance = async () => {
        if(tokenAddress !== null){
            const token = new ethers.Contract(
                tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            const userBalance = await token.balanceOf(message.account)
            setUserBalance(userBalance.toString())
        }
    }
    useEffect(() => {
        getUserBalance()
    }, [tokenAddress])

    // Function to extract image URLs from message text
    const extractImageUrls = (text: string): string[] => {
      const regex = /!\[image\]\((.*?)\)/g;
      let match;
      const urls: string[] = [];
      while ((match = regex.exec(text)) !== null) {
          urls.push(match[1]);
      }
      return urls;
    };

    const imageUrls = extractImageUrls(message.text);

    // Function to extract iframe strings from message text
    const extractIframeStrings = (text: string): string[] => {
      const regex = /<iframe src="(.*?)"/g;
      let match;
      const urls: string[] = [];
      while ((match = regex.exec(text)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

  const iframeStrings = extractIframeStrings(message.text);

  // Remove all image markdowns from message text
  const cleanMessageText = message.text
    .replace(/!\[image\]\(.*?\)/g, '')
    .replace(/<iframe src="(.*?)"/g, "")
    .replace(/\/>/g, "")


  return(
    <div 
      className="message" 
      key={index}
      onMouseEnter={() => sethoverOptions(true)}
      onMouseLeave={() => sethoverOptions(false)}
    >
      <div className='message-header'>
        {
          profilePicsLoading === true ?
          <img src={monkey} alt="User Icon" className='monkey-icon'/> :
            (profilePic !== null && profilePic !== '') ?
            <img src={profilePic} alt="User Icon" className='monkey-icon'/> :
            <img src={monkey} alt="User Icon" className='monkey-icon'/>
        }
      </div>
      <div className="message-content">
        <div className='message-content-row-one'>
          <a 
            href={`https://arbiscan.io/address/${message.account}`}
            className='message-poster-address'
            target='_blank'
            >
              <h3>
              {
                usernameArrayLoading === true ?
                message.account.slice(0, 6) + '...' + message.account.slice(38, 42) :
                  (username !== null && username !== '') ?
                  username :
                  message.account.slice(0, 6) + '...' + message.account.slice(38, 42)
              }
              </h3>
            </a>
          <div className='post-timestamp-token-amount'>
            <div className='post-timestamp-token-amount-title'>
              Post Balance:
            </div>
            <div className='post-timestamp-token-amount-value'>
              {
                tokenDecimals !== null &&
                  ethers.formatUnits(
                    message.messageTimestampTokenAmount.toString(), 
                    tokenDecimals
                  )
              }
            </div>
          </div>
          <div className='current-token-amount'>
            <div className='current-token-amount-title'>
              Current Balance:
            </div>
            <div className='current-token-amount-value'>
              {
                tokenDecimals !== null &&
                userBalance !== null &&
                  ethers.formatUnits(
                      userBalance.toString(), 
                    tokenDecimals
                  )
              }
            </div>
          </div>
          <div className='message-timestamp'>
            {DateTime.fromISO(message.timestamp.toString()).toLocaleString(DateTime.DATETIME_MED)}
          </div>
          {
            hoverOptions === true &&
            <MessageHoverOptions 
              message={message}
              setReplyId={setReplyId}
            />
          }
        </div>
        <div className='message-content-row-two'>
          {
            reply !== null &&
            message.replyId !== null &&
              <div className="message-content-reply-container">
                <div className="reply-icon-preview">
                  <img src="/monkey.svg" alt="default icon" className="reply-preview-icon"/>
                </div>
                <div className="reply-author">
                  {`${reply.account.slice(0,4)}...${reply.account.slice(28,32)}`}
                </div>
                <p className="message-content-reply">
                  {
                  `${reply.text}...`
                  }
                </p>
              </div>
          }
          <p className='message-content-text'>
            {cleanMessageText}
          </p>
          {
            imageUrls.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt={`Linked content ${idx}`} 
                className='message-image' 
              />
            ))
          }
          {
            iframeStrings.map((iframeString, idx) => (
              <iframe
                key={idx}
                src={iframeString}
                title={`Embedded content ${idx}`}
                className="message-iframe"
              />
            ))
          }
        </div>
        <ul className="message-content-row-three">
          {
            Object.keys(message.reactions).length > 0 &&
            Object.entries(message.reactions).map(([key, value]) => (
              (
                message.reactions[key].length > 0 && 
                <li
                  key={key}
                  className="reaction-item"
                  onMouseEnter={() => sethoverReactions(key)}
                  onMouseLeave={() => sethoverReactions(null)}
                >
                  <div className="reaction-emoji">{key}</div>
                  <div className="reaction-count">{value.length}</div>
                </li>
              )
            ))
          }
          {
            hoverReactions !== null &&
            <div className="hover-reactions-accounts">
              <div className="hover-reaction-icon">{hoverReactions}</div>
              <ul className="hover-reaction-address-list">
                {
                  message.reactions[hoverReactions].length > 0 &&
                  message.reactions[hoverReactions].map((address) => (
                    <li className="hover-reaction-address" key={address}>
                      {address.slice(0,4)}...{address.slice(38,42)}
                    </li>
                  ))
                }
              </ul>
            </div>
          }
        </ul>
      </div>
    </div>
  )
}

export default Message