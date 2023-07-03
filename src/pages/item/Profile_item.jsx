import React, { useState, useEffect } from "react";
import "./item.css";
import axios from "axios";

import { useParams } from "react-router";
import { BNPL_ABI } from "../../assets/constants";
import { ethers } from "ethers";

const Item = () => {
  const [nftData, setNftData] = useState([]);
  const { tokenAddress, tokenId } = useParams();
  const [popup, setPopup] = useState("");
  const [dueAmount, setDueAmount] = useState();
  const [chainId, setChainId] = useState();
  const [accounts, setAccounts] = useState([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const handleClick = (e, data) => {
    document.querySelector("#event_popup").classList.add("active");
    setPopup(data);
  };
  function closePopup(e) {
    console.log("closePopup");
    if (!e.target.matches("#event_popup_detail")) {
      e.target.classList.remove("active");
    }
  }

  useEffect(async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAccounts(accounts[0]);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(chainId);
    }

    axios(
      `${process.env.REACT_APP_SERVER_URL}/assets/${tokenAddress}/${tokenId}`
    ).then(({ data }) => {
      setNftData(data[0]);
    });
  }, [chainId]);

  useEffect(async () => {
    getDueAmount().then((res) => {
      setDueAmount(res);
      console.log("due amount: ", dueAmount);
    });
  }, []);

  async function switchChain() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1f91" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1f91",
                chainName: "Shardeum Sphinx DApp 1.X",
                rpcUrls: ["https://dapps.shardeum.org/"],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  async function getDueAmount() {
    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );
      const repayments = await contract.getRepayments(tokenAddress, tokenId);

      const loanData = await contract.getLoanData(tokenAddress, tokenId);
      const dueAmount =
        parseInt(loanData.loanAmount._hex, 16) / 10 ** 18 -
        parseInt(repayments._hex, 16) / 10 ** 18;

      if (dueAmount === 0) {
        axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
          state: "LOAN_REPAID",
          owner: accounts[0],
          tokenId: tokenId,
          contractAddress: tokenAddress,
        });
      }

      return dueAmount;
    }
  }

  async function repay(amount) {
    if (amount <= 0) {
      alert("Amount should be greater than 0");
      return;
    }

    if (amount > dueAmount) {
      alert("Amount is greater than Due Amount");
      return;
    }

    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );
      console.log("amount: ", amount);
      const depositResponse = await contract.repay(tokenAddress, tokenId, {
        value: ethers.utils.parseEther(amount),
      });
      console.log("repayResponse: ", depositResponse);
    }
  }

  async function marginList(price) {
    if (price <= 0) {
      alert("Listing Price should be greater than 0");
      return;
    }

    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      const signer = provider.getSigner();
      const owner = await signer.getAddress();
      const contract = new ethers.Contract(
        process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );
      const _price = ethers.utils.parseEther(price);

      await contract.marginList(tokenAddress, tokenId, _price).then(() => {
        axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
          state: "MARGIN_LISTED",
          price: price,
          owner: owner,
          tokenId: tokenId,
          contractAddress: tokenAddress,
        });
      });
    }
  }

  async function cancelListing() {
    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      const signer = provider.getSigner();
      const owner = await signer.getAddress();
      const contract = new ethers.Contract(
        process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );

      if (nftData.state === "Listed") {
        await contract.cancelListing(tokenAddress, tokenId).then(() => {
          axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
            state: "LISTED_CANCELLED",
            price: 0,
            owner: owner,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });
        });
      }

      if (nftData.state === "MARGIN_LISTED") {
        //await contract.cancelMarginListing(tokenAddress, tokenId).then(() => {
        //   axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
        //     state: "LISTED_CANCELLED",
        //     price: 0,
        //     owner: owner,
        //     tokenId: tokenId,
        //     contractAddress: tokenAddress
        //   });
        // });
      }
    }
  }

  return (
    <>
      {chainId !== "0x1f91" ? (
        <div className=" text-white h-[100vh] flex flex-col justify-center items-center mx-auto text-3xl">
          <h>Please Switch to Shardeum Testnet</h>
          <button
            className="text-[#0ea5e9] bg-gray-800 border-2 border-gray-900 items-center px-3 py-2 text-lg font-medium text-center  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
            onClick={switchChain}
          >
            Switch Network
          </button>
        </div>
      ) : (
        <div className="item flex px-6 text-white mb-0">
          <div className="item-image flex flex-col mt-32 border-r border-gray-200 mb-0">
            <img
              src={`https://ipfs.io/ipfs/${
                nftData.metadata?.imageURI.split("//")[1]
              }`}
              alt=""
              className="rounded-15 w-80 mb-5"
            />
            <div className="mx-auto item-content-title">
              <h1 className="font-bold text-28 ">
                {nftData.metadata?.name} #{nftData?.tokenId}
              </h1>
            </div>
          </div>
          <div className="item-content flex justify-start items-center flex-col">
            <div className=" flex-col mt-4 w-full px-8">
              <div className="p-4 border border-white border-b-0 py-8">
                Description:{" "}
                <span className="font-semibold">
                  {nftData.metadata?.description}
                </span>
              </div>
              <div className="p-4 border border-white border-b-0 py-8">
                Owner: <span className="font-semibold">{nftData.owner}</span>
              </div>
              <div className="p-4 border border-white text-white">
                <div className="flex justify-around my-4">
                  <div className="flex flex-col items-center">
                    <div>Price</div>
                    <div className="text-5xl font-bold">
                      {nftData.price} ETH
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div>Remaining Amount</div>
                    <div className="text-5xl font-bold">30%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto my-8 item-content-buy">
              {(() => {
                if (nftData.state === "LISTED") {
                  return (
                    <button className="primary-btn" onClick={cancelListing()}>
                      Cancel Listing
                    </button>
                  );
                } else if (nftData.state === "MARGIN_LISTED") {
                  return (
                    <div>
                      <button className="primary-btn" onClick={cancelListing()}>
                        Cancel Listing
                      </button>
                      <button
                        className="primary-btn"
                        onClick={(e) => {
                          handleClick(e, "Repay");
                        }}
                      >
                        Repay
                      </button>
                    </div>
                  );
                } else if (nftData.state === "BNPL_LOAN_ACTIVE") {
                  return (
                    <div>
                      <button
                        className="primary-btn"
                        onClick={(e) => {
                          handleClick(e, "Repay");
                        }}
                      >
                        Repay
                      </button>
                      <button
                        className="primary-btn"
                        onClick={(e) => {
                          handleClick(e, "Margin_List");
                        }}
                      >
                        List for Sale
                      </button>
                    </div>
                  );
                } else if (nftData.state === "CLAIMED") {
                  return <button className="primary-btn">MARGIN_LISTED</button>;
                }
              })()}
            </div>
          </div>
          <div id="event_popup" onClick={closePopup}>
            <div
              id="event_popup_detail"
              className="text-white border-2 shadow-lg shadow-cyan-500/50 border-sky-500/70 rounded-md"
            >
              {popup === "Repay" && (
                <div className="h-full flex flex-col justify-center items-center">
                  <p className="text-xl mb-5">Due Amount: {dueAmount} SHM</p>
                  <input
                    className=" mb-5 text-lg text-black px-5 rounded-xl"
                    type="text"
                    id="repayAmount"
                  />
                  <button
                    className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
                    onClick={() => {
                      repay(document.getElementById("repayAmount").value);
                    }}
                  >
                    Repay
                  </button>
                </div>
              )}
              {popup === "Margin_List" && (
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="text-2xl mb-5">
                    Put your NFT's for margin sale
                  </div>
                  <input
                    className=" text-lg text-black mb-5 px-5 rounded-xl"
                    type="text"
                    id="marginPrice"
                  />
                  <button
                    className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
                    onClick={() => {
                      marginList(document.getElementById("marginPrice").value);
                    }}
                  >
                    List for Sale
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Item;
