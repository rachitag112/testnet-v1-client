import React from 'react'

export default function StakingPage() {
  const [active, setActive] = React.useState('deposit')

  return (
    <div className=' text-white h-[100vh] w-1/2 mx-auto'>
      <div className='mt-20 text-3xl text-center'>GearFi Vault</div>
      <div className='text-xl mt-4 text-center mb-4'>
        Deposit ETH to Earn Exciting APR.
      </div>
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
          <div className='flex flex-col items-center'>
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
                <div>Balance: 0</div>
                <div>max 0 Eth</div>
              </div>
            </div>
            {/* <div className='flex bg-slate-900 w-5/6 justify-center p-8 m-4 rounded-md'>
            Deposit ETH to GearFi Vault.
          </div> */}
            <div className='flex'>
              <div className='text-black border-2 border-black bg-gradient-to-r  from-gray-800 to-green-200 m-4 p-2 cursor-pointer'>
                Deposit
              </div>
            </div>
          </div>
        )}
        {active === 'withdraw' && (
          <div className='flex flex-col items-center'>
            <div className='text-3xl mt-4'>GearFi Testnets</div>
            <div>Withdraw your ETH deposits from GearFi.</div>
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
                <div>Balance: 0</div>
                <div>max 0 Eth</div>
              </div>
            </div>
            {/* <div className='flex bg-slate-900 w-5/6 justify-center p-8 m-4 rounded-md'>
              Withdraw your ETH deposits from GearFi.
            </div> */}
            <div className='flex bg-slate-500 w-5/6 justify-center p-4 m-4 rounded-md'>
              <input
                type='checkbox'
                name=''
                id=''
                className='mx-4 bg-transparent'
              />
              Withdraw all - Withdraw total deposited ETH
            </div>
            <div className='flex'>
              <div className='text-black border-2 border-black bg-gradient-to-r  from-gray-800 to-green-200 m-4 p-2 cursor-pointer'>
                Withdraw
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
