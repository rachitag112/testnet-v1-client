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
    console.log(`http://localhost:8000/assets?owner=${userAddress}`)
    axios(`http://localhost:8000/assets?owner=${userAddress}`).then(
      ({ data }) => {
        console.log('krishna!!')
        setNftData(data)
      }
    )
  }, [])

  console.log('datacollection ', nftData)
  return (
    <div className='text-white mt-20'>
      <div className='flex flex-col items-center'>
        <img src={userProfile} alt='' className='w-24 mt-8 rounded-full' />
        <div className=' text-4xl font-bold mb-2'>
          {userAddress.slice(0, 4)}...{userAddress.slice(-4)}
        </div>
      </div>
      <div className='flex justify-start'>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            listings ? 'text-red-600' : ''
          }`}
          onClick={() => setListings(true)}
        >
          Listings
        </div>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            !listings ? 'text-red-600' : ''
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
            if (nft.state === 'listed' || nft.state === 'margin-trade')
              return (
                <Link
                  to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                  state={{ data: nft }}
                >
                  <div className='flex flex-col m-2 mt-8 w-56 h-72 border-2 border-indigo-300'>
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
                      <div className='flex'>
                        <div className='w-24 text-sm'>
                          FLOOR PRICE:
                          <br />
                          {nft.price}
                        </div>
                        <div className='ml-4 w-20 text-sm'>
                          LAST SALE:
                          <br />
                          {nft.lastSale}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          })}
        </div>
      )}
      {!listings && (
        <div className='grid grid-cols-5 m-2'>
          {nftData.map((nft) => {
            return (
              <Link
                to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                state={{ data: nft }}
              >
                <div className='flex flex-col m-2 mt-8 w-56 h-72 border-2 border-indigo-300'>
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
                    <div className='flex'>
                      <div className='w-24 text-sm'>
                        FLOOR PRICE:
                        <br />
                        {nft.price}
                      </div>
                      <div className='ml-4 w-20 text-sm'>
                        LAST SALE:
                        <br />
                        {nft.lastSale}
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
