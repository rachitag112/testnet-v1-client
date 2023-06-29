import React, { useState, useEffect } from 'react'
import './item.css'
import axios from 'axios'

import { useParams } from 'react-router'
import { BNPL_CONTRACT_ADDRESS, BNPL_ABI } from '../../assets/constants'
import { ethers } from 'ethers'
// import { Link } from 'react-router-dom'
// import LinedChart from '../../components/lineChart/LinedChart'

const Item = () => {
  const [nftData, setNftData] = useState([])
  const { tokenAddress, tokenId } = useParams()
  const [open, setOpen] = useState(false)
  const [popup, setPopup] = useState('')

  // const handleOpen = () => setOpen(!open)
  const handleClick = (e, data) => {
    document.querySelector('#event_popup').classList.add('active')
    setPopup(data)
  }
  function closePopup(e) {
    console.log('closePopup')
    if (!e.target.matches('#event_popup_detail')) {
      e.target.classList.remove('active')
    }
  }

  useEffect(() => {
    axios(
      `${process.env.REACT_APP_SERVER_URL}/assets/${tokenAddress}/${tokenId}`
    ).then(({ data }) => {
      // console.log('datacollection type', data[0].owner)
      setNftData(data[0])
    })
  }, [tokenAddress, tokenId])

  

  return (
    <div className='item flex px-6 text-white mt-20'>
      <div className='item-image flex flex-col mt-32 border-r border-gray-200'>
        <img
          src={`https://ipfs.io/ipfs/${
            nftData.metadata?.imageURI.split('//')[1]
          }`}
          alt=''
          className='rounded-15 w-80 mb-5'
        />
        <div className='mx-auto item-content-title'>
          <h1 className='font-bold text-28 '>
            {nftData.metadata?.name} #{nftData?.tokenId}
          </h1>
        </div>
      </div>
      <div className='item-content flex justify-start items-center flex-col  relative'>
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
                <div>Remaining Amount</div>
                <div className='text-5xl font-bold'>30%</div>
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto my-8 item-content-buy'>
          {nftData.state === 'LISTED' ? (
            <div>
              <button className='primary-btn'>Cancel Listing</button>
            </div>
          ) : (
            <div className='flex'>
              <div
                onClick={(e) => {
                  handleClick(e, 'Repay')
                }}
              >
                <button className='primary-btn'>Repay Loan</button>
              </div>
              <div
                onClick={(e) => {
                  handleClick(e, 'Margin_Trade')
                }}
              >
                <button className='primary-btn'>List for Margin Sale</button>
              </div>
            </div>
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
      <div id='event_popup' onClick={closePopup}>
        <div
          id='event_popup_detail'
          className='text-white border-2 shadow-lg shadow-cyan-500/50 border-sky-500/70 rounded-md'
        >
          {popup === 'Repay' && (
            <div className='h-full flex flex-col justify-center items-center'>
              <input type='text' />
              <button>Repay</button>
            </div>
          )}
          {popup === 'Margin_Trade' && (
            <div className='h-full flex flex-col justify-center items-center'>
              <div>Put your NFT's for margin sale</div>
              <input type="text" />
              <button>Sale</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item