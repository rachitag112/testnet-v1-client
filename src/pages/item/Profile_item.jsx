import React, { useState, useEffect } from 'react'
import './item.css'
import axios from 'axios'
import LinedChart from '../../components/lineChart/LinedChart'

import { useParams } from 'react-router'
import {
  BNPL_CONTRACT_ADDRESS,
  BNPL_ABI,
  CHAIN_ID,
} from '../../assets/constants'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'

const Item = () => {
  const [nftData, setNftData] = useState([])
  const { tokenAddress, tokenId } = useParams()

  useEffect(() => {
    axios(
      `https://gearfi-testnet.onrender.com/assets/${tokenAddress}/${tokenId}`
    ).then(({ data }) => {
      console.log('datacollection type', data[0].owner)
      setNftData(data[0])
    })
  }, [tokenAddress, tokenId])

  async function bnplInitialize() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (accounts.length === 0) {
      alert('Please connect Wallet')
      return
    }
    // console.log("chainId: ", chainId)
    // if (chainId !== 0x539) {
    //   alert("Please switch to Ganache");

    //   return;
    // }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      )

      //const price = nftData.price
      const response = await contract.BNPLInitiate(tokenAddress, tokenId, {
          value: ethers.utils.parseEther('0.3')
        }).then(() => {
          axios.patch('https://gearfi-testnet.onrender.com/state', {
            state: 'BNPL_LOAN_ACTIVE',
            owner: signer.getAddress(),
            tokenId: tokenId,
            nftAddress: tokenAddress,
          })
        });

      console.log(response)
    } else alert('Sorry no wallet found')
  }

  return (
    <div className='item flex px-6 text-white mt-20 h-screen'>
      <div className='item-image flex flex-col mt-40 border-r border-gray-200'>
        <img
          src={`https://ipfs.io/ipfs/${
            nftData.metadata?.imageURI.split('//')[1]
          }`}
          alt=''
          className='rounded-15'
        />
      </div>
      <div className='item-content flex justify-start items-center flex-col m-5 relative'>
        <div className='mx-auto item-content-title'>
          <h1 className='font-bold text-28 '>
            {nftData.metadata?.name} #{nftData?.tokenId}
          </h1>
        </div>
        <div className=' flex-col mt-4 w-full px-8'>
          <div className='p-4 border border-white border-b-0 py-8'>
            Description:{' '}
            <span className='font-semibold'>
              {nftData.metadata?.description}
            </span>
          </div>
          <div className='p-4 border border-white border-b-0 py-8'>
            Owner: <span className='font-semibold'>{nftData.owner}</span>
          </div>
          <div className='p-4 border border-white text-white'>
            <div className='flex justify-around my-4'>
              <div className='flex flex-col items-center'>
                <div>Price</div>
                <div className='text-5xl font-bold'>{nftData.price} ETH</div>
              </div>
              <div className='flex flex-col items-center'>
                <div>Downpayment</div>
                <div className='text-5xl font-bold'>30%</div>
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto my-8 item-content-buy mb-4'>
          {nftData.state === 'LISTED' ? (
            <div>
              <div className='relative inline-block'>
                <button className='primary-btn mb-0' onClick={bnplInitialize}>
                  {' '}
                  Buy Now Pay Later
                </button>
              </div>
              <button className='primary-btn'>Make Offer</button>
            </div>
          ) : (
            <Link
              to={`/user/${window.ethereum.selectedAddress}`}
              state={{ data: window.ethereum.selectedAddress }}
            >
              <button className='primary-btn'>Checkout Sale</button>
            </Link>
          )}
        </div>
        {/* <LinedChart /> */}
        {/* <div className='m-4 mt-8 border border-white'>
          Offers:
          <table className='w-full border border-white'>
            <thead>
              <tr>
                <th className='p-4'>SUPPLY</th>
                <th className='p-4'>SUPPLY</th>
                <th className='p-4'>SUPPLY</th>
                <th className='p-4'>SUPPLY</th>
                <th className='p-4'>SUPPLY</th>
              </tr>
            </thead>
            <tbody>
                <th className='font-semibold'>0.05ETH</th>
                <th className='font-semibold'>0.05ETH</th>
                <th className='font-semibold'>0.05ETH</th>
                <th className='font-semibold'>0.05ETH</th>
                <th className='font-semibold'>0.05ETH</th>
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  )
}

export default Item
