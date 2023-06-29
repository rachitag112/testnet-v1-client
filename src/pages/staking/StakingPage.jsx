import React, { useState } from 'react'
import { useEffect } from 'react'
import { ethers } from 'ethers'
import {BNPL_ABI} from  '../../assets/constants'


export default function StakingPage() {
  const [active, setActive] = React.useState('deposit')
  const [vaultBalance, setVaultBalance] = useState('')
  
  
  useEffect(() => {
    getVaultBalance()
  })

  async function getVaultBalance(){
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
      process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
      BNPL_ABI,
      provider
    )
     const vaultBalance = await contract.getVaultBalance();
        setVaultBalance(vaultBalance._hex)
       
    }
    
  }
  return (
    <div className=' text-white h-[100vh] w-1/2 mx-auto mt-10'>
      <div className='mt-20 text-3xl text-center'>GearFi Vault</div>
      {active === 'deposit' ? <div className='text-xl mt-4 text-center mb-4'>
        Deposit SHM into vault
      </div>
      :
      <div className='text-xl mt-4 text-center mb-4'>
        Withdraw SHM from vault
      </div>
      }
      <div className='border border-slate-500'>
        <div className='flex justify-center '>
          <div
            className={`m-4  p-4 ${
              active === 'deposit'
                ? 'bg-slate-700 rounded-xl'
                : 'white-glassmorphism'
            } 
          cursor-pointer`}
            onClick={() => {
              setActive('deposit')
            }}
          >
            Deposit
          </div>
          <div
            className={`m-4  p-4 ${
              active === 'withdraw'
                ? 'bg-slate-700 rounded-xl'
                : 'white-glassmorphism'
            } 
          cursor-pointer`}
            onClick={() => {
              setActive('withdraw')
            }}
          >
            Withdraw
          </div>
        </div>
        {active === 'deposit' && (
          
          <div className='flex flex-col items-center h-48'>
            
            <div className='flex border border-white w-5/6 justify-between p-4 m-4 rounded-md'>
              <div className='flex flex-col '>
                <div>Amount</div>
                <div>
                  <input
                    type='text'
                    placeholder='0.0'
                    className='text-black bg-transparent border-white'
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <div>Your Balance: 0</div>
                <div>Vault Balance: {parseInt(vaultBalance, 16) / (10**18)} SHM</div>
              </div>
            </div>
            {/* <div className='flex bg-slate-900 w-5/6 justify-center p-8 m-4 rounded-md'>
            Deposit ETH to GearFi Vault.
          </div> */}
            <div className='flex'>
              <div className='text-[#0ea5e9] bg-gray-800 border-2 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4 cursor-pointer'>
                Deposit
              </div>
            </div>
          </div>
        )}
        {active === 'withdraw' && (
          <div className='flex flex-col items-center h-48'>
    
            <div className='flex border border-white w-5/6 justify-between p-4 m-4 rounded-md'>
              <div className='flex flex-col'>
                <div>Amount</div>
                <div>
                  <input
                    type='text'
                    placeholder='0.0'
                    className='text-black bg-transparent'
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <div>Your Balance: 0</div>
                <div>max withdraw : 0 Eth</div>
              </div>
            </div>
           
            {/* <div className='flex bg-slate-500 w-5/6 justify-center p-4 m-4 rounded-md'>
              <input
                type='checkbox'
                name=''
                id=''
                className='mx-4 bg-transparent'
              />
              Withdraw all - Withdraw total deposited ETH
            </div> */}
            <div className='flex'>
              <div className='text-[#0ea5e9] bg-gray-800 border-2 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4 cursor-pointer'>
                Withdraw
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
