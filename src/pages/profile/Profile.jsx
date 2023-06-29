import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { useLocation } from "react-router";
import './profile.css'
import axios from 'axios'
import userProfile from '../../assets/profile.jpeg'
// import Web3 from 'web3'
import { useParams } from 'react-router'

/***************************************************************** */
import { AiOutlineArrowRight } from 'react-icons/ai'

const Profile = () => {
  const { userAddress } = useParams()

  const [listings, setListings] = React.useState(true)
  const [nftData, setNftData] = useState([])

  useEffect(() => {
    console.log(`${process.env.REACT_APP_SERVER_URL}/assets?owner=${userAddress}`)
    axios(`${process.env.REACT_APP_SERVER_URL}/assets?owner=${userAddress}`).then(
      ({ data }) => {
        
        setNftData(data)
        console.log("data: ", data)
      }
    )
  }, [userAddress])

  console.log('datacollection ', nftData)
  return (
    <div className='text-white mt-20 h-full'>
      <div className='flex flex-col items-center'>
        <img src={userProfile} alt='' className='w-24 mt-8 rounded-full' />
        <div className=' text-4xl font-bold mb-2'>
          {userAddress.slice(0, 4)}...{userAddress.slice(-4)}
        </div>
      </div>
      <div className='flex justify-start'>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            listings ? 'text-red-300' : ''
          }`}
          onClick={() => setListings(true)}
        >
          Listings
        </div>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            !listings ? 'text-red-300' : ''
          }`}
          onClick={() => setListings(false)}
        >
          My NFTs
        </div>
      </div>
      {listings && (
        <div className='grid grid-cols-5 m-2'>
          {nftData.map((nft) => {
            console.log('nft', nft.state)
            if (nft.state === 'LISTED' || nft.state === 'MARGIN_TRADE')
              return (
                <Link
                  to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                  state={{ data: nft }}
                >
                  <div className='flex flex-col m-2 mt-8 w-56 h-84 border-2 border-red-200 rounded-xl'>
                    <img
                      src={`https://ipfs.io/ipfs/${
                        nft.metadata?.imageURI.split('//')[1]
                      }`}
                      alt=''
                      className='w-64 h-48'
                    />
                    <div className='flex flex-col mt-0 p-4'>
                      <div className='font-bold mb-2 flex items-center justify-between'>
                        <div>{nft.metadata?.name} #{nft.tokenId}</div>
                        <div>
                          <AiOutlineArrowRight className='mr-4' />
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              )
              else return(
                <div> No NFTs Found</div>
              )
          })}
        </div>
      )}
      {!listings && (
        <div className='grid grid-cols-5 m-2'>
          {nftData.map((nft) => {
            console.log('label2: ', nftData)
            if(nft.state === "BNPL_LOAN_ACTIVE")
            return (
              <Link
                to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                state={{ data: nft }}
              >
                <div className='flex flex-col m-2 mt-8 w-56 h-84 border-2 border-red-200 rounded-xl'>
                  <img
                    src={`https://ipfs.io/ipfs/${
                      nft.metadata?.imageURI.split('//')[1]
                    }`}
                    alt=''
                    className='w-64 h-48'
                  />
                  <div className='flex flex-col mt-0 p-4'>
                    <div className='font-bold mb-2 flex items-center justify-between'>
                      <div>{nft.metadata?.name}</div>
                      <div>
                        <AiOutlineArrowRight className='mr-4' />
                      </div>
                    </div>
                    
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Profile
