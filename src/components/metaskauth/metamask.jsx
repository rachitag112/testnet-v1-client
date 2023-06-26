import { AiOutlineClose } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'
import { BiExit } from 'react-icons/bi'
import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext/UserContext'
import './metamaskauth.css'
const userImage = require('../../assets/user.jpg')

const MetaMaskAuthButton = () => {
  const { user, setUser } = useContext(UserContext)
  const [isConnected, setIsConnected] = useState(false)
  const [userId, setUserId] = useState('')
  const [signature, setSignature] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toggleMenu, setToggleMenu] = React.useState(false)

  const dropdownRef = useRef(null)

  const handleMenuToggle = () => {
    console.log(menuOpen)
    setMenuOpen(!menuOpen)
  }

  const handleViewProfile = () => {}
  const sliceIt = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const connectAndSign = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request MetaMask user's permission to connect
        await window.ethereum.enable()
        // User is now connected to MetaMask

        // Get the connected user's address
        const address = window.ethereum.selectedAddress
        setUserId(address)
        //console.log('ethereum address', address)

        // Generate a random message to sign
        const message = 'I want to login on to GearFi Testnet App.'
        // Request user's permission to sign the message
        const signedMessage = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address],
        })
        // Set the signature in the state
        setSignature(signedMessage)
        //console.log('signature', signature)

        setIsConnected(true)
        localStorage.setItem('isWalletConnected', true)
        //console.log(isConnected)

        // Set the user information in the UserContext
        setUser({ id: userId })
        console.log('user is:', user)
      } else {
        // MetaMask is not installed, handle the error or prompt the user to install it
        console.error('MetaMask is not installed.')
      }
    } catch (error) {
      // Error occurred during MetaMask authentication or message signing
      setIsConnected(false)
      setUserId('')
      console.error('Error:', error)
    }
  }

  const disconnectFromMetaMask = () => {
    setIsConnected(false)
    localStorage.setItem('isWalletConnected', false)
    setUserId('')
    // Perform any additional cleanup or state reset here
  }
  const NavbarItem = ({ title, classProps }) => {
    return <li className={`mx-4  cursor-pointer ${classProps}`}>{title}</li>
  }
  return (
    <div className='metamask-auth-wrapper z-2'>
      {isConnected ? (
        <div className='relative'>
          {!toggleMenu && (
            <div
              className='flex flex-row cursor:pointer items-center'
              onClick={() => setToggleMenu(true)}
            >
              <p className='text-white text-xl mr-2'>{sliceIt(userId)}</p>
              <img src={userImage} alt='' className='w-12 rounded-full' />
            </div>
          )}
          {toggleMenu && (
            <ul
              className='mt-20 bg-black top-0 -right-2 p-3 w-[70w] h-[150px] shadow-2xl 
              flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in'
            >
              {console.log('acco', window.ethereum.selectedAddress)}
              <div className='flex flex-col items-center'>
                <AiOutlineClose
                  onClick={() => setToggleMenu(false)}
                  className='self-start text-2xl mb-4'
                />
                <Link to={`/user/${userId}`} state={{ data: window.ethereum.selectedAddress }}>
                  <p className='cursor-pointer text-xl mb-4 hover:scale-110 flex items-center'>
                  <AiOutlineUser className='mr-2'/>
                    My Profile
                  </p>
                </Link>
                <p
                  className='cursor-pointer text-xl mb-8 hover:scale-110 flex items-center'
                  onClick={disconnectFromMetaMask}
                >
                  <BiExit className='mr-2'/>
                  Disconnect
                </p>
              </div>
            </ul>
          )}
          {menuOpen && <div className='text-white'>hidden</div>}
        </div>
      ) : (
        <button
          onClick={connectAndSign}
          className='text-[#0ea5e9] bg-gray-800 border-2 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 '
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default MetaMaskAuthButton
