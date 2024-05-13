import React, { MouseEventHandler, useState, useEffect } from "react";
import {ethers} from 'ethers';
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import Channel from "./Channel";

interface ChannelsProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  alphaPING: AlphaPING | null;
  channels: AlphaPING.ChannelStructOutput[];
  currentChannel: AlphaPING.ChannelStructOutput | null;
  setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
  channelAction: string;
  setChannelAction: React.Dispatch<React.SetStateAction<string>>;
  setTokenMetaData:React.Dispatch<React.SetStateAction<tokenMetadata>>;
  tokenMetada:tokenMetadata;
}

const Channels:React.FC<ChannelsProps> = ({ 
  provider, 
  account, 
  alphaPING, 
  channels, 
  currentChannel, 
  setCurrentChannel,
  channelAction,
  setChannelAction,
  setTokenMetaData,
  tokenMetada
}) => {

    const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
      const action = (e.target as HTMLElement).id
      setChannelAction(action)
    }
  
    return (
      <div className="channels">
        <div className="channels-text">
          <h2 className="channels-title">
            Channels
          </h2>
          <ul className="channels-list">
            {
              channels.map((channel, index) => (
                <Channel
                  channel={channel}
                  index={index}
                  currentChannel={currentChannel}
                  alphaPING={alphaPING}
                  account={account}
                  provider={provider}
                  setCurrentChannel={setCurrentChannel}
                  setTokenMetaData={setTokenMetaData}
                  tokenMetada={tokenMetada}
                />
              ))
            }
          </ul>
        </div>
  
        <div className="channel-actions">
          <h2>Channel Actions</h2>
          <ul className="channel-actions-list">
            <li 
              className= {
                channelAction ==  "chat" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="chat"
              onClick={(e) => channelActionHandler(e)}
            >
              Chat
            </li>
            <li 
              className= {
                channelAction ==  "analyze" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="analyze"
              onClick={(e) => channelActionHandler(e)}
            >Analyze</li>
            <li 
              className= {
                channelAction ==  "trade" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="trade"
              onClick={(e) => channelActionHandler(e)}
            >
              Trade
            </li>
          </ul>
        </div>
      </div>
    );
  }
  
  export default Channels;