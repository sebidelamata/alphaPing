import React from "react";
import {ethers} from 'ethers';
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';

interface ChannelsProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  alphaPING: AlphaPING | null;
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
}

const Channels:React.FC<ChannelsProps> = ({ 
  provider, 
  account, 
  alphaPING, 
  channels, 
  currentChannel, 
  setCurrentChannel 
}) => {
    const channelHandler = async (channel:Channel) => {
      // Check if user has joined
      // If they haven't allow them to mint.
      const hasJoined = await alphaPING?.hasJoinedChannel(
        BigInt(channel.id), 
        account || ethers.ZeroAddress
      )
  
      if (hasJoined) {
        setCurrentChannel(channel)
      } else {
        const signer:any = await provider?.getSigner()
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
      }
    }
  
    return (
      <div className="channels">
        <div className="channels__text">
          <h2>Text Channels</h2>
  
          <ul>
            {channels.map((channel, index) => (
              <li
                onClick={() => channelHandler(channel)} key={index}
                className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}>
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
  
        <div className="channels__voice">
          <h2>Voice Channels</h2>
  
          <ul>
            <li>Channel 1</li>
            <li>Channel 2</li>
            <li>Channel 3</li>
          </ul>
        </div>
      </div>
    );
  }
  
  export default Channels;