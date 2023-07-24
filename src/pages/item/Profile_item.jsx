import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

import "./item.css";
import axios from "axios";

import { BNPL_ABI, NFT_ABI } from "../../assets/constants";
import { ethers } from "ethers";

const Item = () => {
  const [nftData, setNftData] = useState([]);
  const { tokenAddress, tokenId } = useParams();
  const [popup, setPopup] = useState("");
  const [loanAmount, setLoanAmount] = useState();
  const [chainId, setChainId] = useState();
  const [accounts, setAccounts] = useState([]);
  const [dueAmount, setDueAmount] = useState();
  const [loading, setLoading] = useState(false);
  const loanStates = [
    "ACTIVE",
    "BNPL_LOAN_ACTIVE",
    "LOAN_REPAID",
    "MARGIN_LISTED",
    "NFT_CLAIMED",
  ];

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

  useEffect(() => {
    async function setup() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setAccounts(accounts[0]);
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(chainId);
      }
    }

    axios(
      `${process.env.REACT_APP_SERVER_URL}/assets/${tokenAddress}/${tokenId}`
    ).then(({ data }) => {
      setNftData(data[0]);
    });

    setup();
  }, []);

  useEffect(() => {
    getLoanAmount();
    updateDueAmount();
  });

  const updateDueAmount = async () => {
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

      setDueAmount(dueAmount);
    }
  };

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

  async function getLoanAmount() {
    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );

      const loanData = await contract.getLoanData(tokenAddress, tokenId);
      const loanAmount = parseInt(loanData.loanAmount._hex, 16) / 10 ** 18;
      setLoanAmount(loanAmount);
    }
  }

  async function repayLoan(e, amount) {
    if (isNaN(parseFloat(amount))) {
      toast.error("Amount is not a Valid Number", { toastId: "repayLoan" });
      return;
    }
    if (amount <= 0) {
      toast.error("Amount should be greater than 0", { toastId: "repayLoan" });
      return;
    }

    if (amount > dueAmount) {
      toast.error("Amount is greater than Due Amount", {
        toastId: "repayLoan",
      });
      return;
    }

    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      try {
        e.target.disabled = true;

        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(
          process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
          BNPL_ABI,
          signer
        );

        const repayResponse = await contract.repayLoan(tokenAddress, tokenId, {
          value: ethers.utils.parseEther(amount),
        });

        const txConfirm = await provider.getTransaction(repayResponse.hash);

        if (txConfirm) {
          toast.loading("Please Wait... ", { toastId: "repayLoan" });
          document.querySelector("#event_popup")?.classList.remove("active");
        }

        const confirmedTransaction = await provider.waitForTransaction(
          repayResponse.hash,
          1
        );

        if (confirmedTransaction.status === 1) {
          const loanData = await contract.getLoanData(tokenAddress, tokenId);

          updateDueAmount();

          let loanState = loanStates[loanData.state];

          setNftData({
            ...nftData,
            state: loanState,
          });

          axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
            state: loanState,
            owner: owner,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });

          toast.update("repayLoan", {
            render: "Transaction completed!!",
            type: "success",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        } else {
          toast.update("repayLoan", {
            render: "Unknown Error occur, while processing transaction!!",
            type: "error",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        }

        e.target.disabled = false;
      } catch (err) {
        let msg = "Unknown Error occur, while processing transaction!!";
        e.target.disabled = false;

        if (err.code === "ACTION_REJECTED") {
          msg = "Transaction Rejected By User!";
          toast.error(msg);

          return;
        }

        toast.update("repayLoan", {
          render: msg,
          type: "error",
          isLoading: false,
          closeOnClick: true,
          autoClose: 3000,
        });
        console.log("Error : ", err);
      }
    } else {
      toast.error("No wallet Found!", { toastId: "repayLoan" });
    }
  }

  async function marginList(e, price) {
    if (isNaN(parseFloat(price)))
      toast.error("Price is not a Valid Number", { toastId: "repayLoan" });

    if (price <= 0) {
      toast.error("Listing Price should be greater than 0", {
        toastId: "marginList",
      });
      return;
    }

    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      e.target.disabled = true;

      try {
        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(
          process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
          BNPL_ABI,
          signer
        );
        const _price = ethers.utils.parseEther(price);
        const response = await contract.marginList(
          tokenAddress,
          tokenId,
          _price
        );
        const txConfirm = await provider.getTransaction(response.hash);

        if (txConfirm) {
          toast.loading("Please wait... ", { toastId: "marginList" });
          document.querySelector("#event_popup")?.classList.remove("active");
        }
        const confirmedTransaction = await provider.waitForTransaction(
          response.hash,
          1
        );

        if (confirmedTransaction.status === 1) {
          const loanData = await contract.getLoanData(tokenAddress, tokenId);
          let loanState = loanStates[loanData.state];

          setNftData({
            ...nftData,
            state: loanState,
          });

          axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
            state: loanState,
            owner: owner,
            price: price,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });

          toast.update("marginList", {
            render: "Trasaction completed!!",
            type: "success",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        } else {
          toast.update("marginList", {
            render: "Unknown Error occur, while processing transaction!!",
            type: "error",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        }

        e.target.disabled = false;
      } catch (err) {
        let msg = "Unknown Error occur, while processing transaction!!";
        e.target.disabled = false;

        if (err.code === "ACTION_REJECTED") {
          msg = "Transaction Rejected By User!";
          toast.error(msg);

          return;
        }

        toast.update("marginList", {
          render: msg,
          type: "error",
          isLoading: false,
          closeOnClick: true,
          autoClose: 3000,
        });
        console.log("Error : ", err);
      }
    } else {
      toast.error("No wallet Found!", { toastId: "marginList" });
    }
  }

  async function listNFT(e, price) {
    if (isNaN(parseFloat(price)))
      toast.error("Price is not a Valid Number", { toastId: "repayLoan" });

    if (price <= 0) {
      toast.error("Listing Price should be greater than 0", {
        toastId: "ListNFT",
      });
      return;
    }

    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      e.target.disabled = true;

      try {
        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(
          process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
          BNPL_ABI,
          signer
        );
        
        const nftContract = new ethers.Contract(tokenAddress, NFT_ABI, signer)
        const approveResponse = await nftContract.approve(process.env.REACT_APP_BNPL_CONTRACT_ADDRESS, tokenId)
        
        const txConfirm = await provider.getTransaction(approveResponse.hash);

        if (txConfirm) {
          toast.loading("Please wait... ", { toastId: "ListNFT" });
          document.querySelector("#event_popup")?.classList.remove("active");
        }

        const _price = ethers.utils.parseEther(price);
        const response = await contract.listItem(
          tokenAddress,
          tokenId,
          _price
        );
        
        const confirmedTransaction = await provider.waitForTransaction(
          response.hash,
          1
        );

        if (confirmedTransaction.status === 1) {

          setNftData({
            ...nftData,
            state: "LISTED",
          });

          axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
            state: "LISTED",
            owner: owner,
            price: price,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });

          toast.update("ListNFT", {
            render: "Trasaction completed!!",
            type: "success",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        } else {
          toast.update("ListNFT", {
            render: "Unknown Error occur, while processing transaction!!",
            type: "error",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        }

        e.target.disabled = false;
      } catch (err) {
        let msg = "Unknown Error occur, while processing transaction!!";
        e.target.disabled = false;

        if (err.code === "ACTION_REJECTED") {
          msg = "Transaction Rejected By User!";
          toast.error(msg);

          return;
        }

        toast.update("ListNFT", {
          render: msg,
          type: "error",
          isLoading: false,
          closeOnClick: true,
          autoClose: 3000,
        });
        console.log("Error : ", err);
      }
    } else {
      toast.error("No wallet Found!", { toastId: "ListNFT" });
    }
  }

  async function cancelListing(e) {
    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      e.target.disabled = true;

      try {
        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(
          process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
          BNPL_ABI,
          signer
        );

        if (nftData.state === "LISTED") {
          const response = await contract.cancelListing(tokenAddress, tokenId);
          const txConfirm = await provider.getTransaction(response.hash);

          if (txConfirm)
            toast.loading("Please wait...", { toastId: "cancelListing" });

          const confirmedTransaction = await provider.waitForTransaction(
            response.hash,
            1
          );

          if (confirmedTransaction.status === 1) {
            setNftData({
              ...nftData,
              state: "LISTED_CANCELLED",
            });
            axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
              state: "LISTED_CANCELLED",
              owner: owner,
              price: 0,
              tokenId: tokenId,
              contractAddress: tokenAddress,
            });

            toast.update("cancelListing", {
              render: "Trasaction completed!!",
              type: "success",
              isLoading: false,
              closeOnClick: true,
              autoClose: 3000,
            });
          } else {
            toast.update("cancelListing", {
              render: "Unknown Error occur, while processing transaction!!",
              type: "error",
              isLoading: false,
              closeOnClick: true,
              autoClose: 3000,
            });
          }
        } else if (nftData.state === "MARGIN_LISTED") {
          const response = await contract.cancelMarginListing(
            tokenAddress,
            tokenId
          );

          const txConfirm = await provider.getTransaction(response.hash);
          if (txConfirm)
            toast.loading("Please wait...", { toastId: "cancelListing" });

          const confirmedTransaction = await provider.waitForTransaction(
            response.hash,
            1
          );

          if (confirmedTransaction.status === 1) {
            setNftData({
              ...nftData,
              state: "MARGIN_LISTED_CANCELLED",
            });
            axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
              state: "MARGIN_LISTED_CANCELLED",
              owner: owner,
              price: 0,
              tokenId: tokenId,
              contractAddress: tokenAddress,
            });

            toast.update("cancelListing", {
              render: "Trasaction completed!!",
              type: "success",
              isLoading: false,
              closeOnClick: true,
              autoClose: 3000,
            });
          } else {
            toast.update("cancelListing", {
              render: "Unknown Error occur, while processing transaction!!",
              type: "error",
              isLoading: false,
              closeOnClick: true,
              autoClose: 3000,
            });
          }
        }

        e.target.disabled = true;
      } catch (err) {
        let msg = "Unknown Error occur, while processing transaction!!";
        e.target.disabled = false;

        if (err.code === "ACTION_REJECTED") {
          msg = "Transaction Rejected By User!";
          toast.error(msg);

          return;
        }

        toast.update("cancelListing", {
          render: msg,
          type: "error",
          isLoading: false,
          closeOnClick: true,
          autoClose: 3000,
        });
        console.log("Error : ", err);
      }
    } else {
      toast.error("No wallet Found!", { toastId: "cancelListing" });
    }
  }

  async function claimNFT(e) {
    if (window.ethereum && chainId === "0x1f91" && accounts.length > 0) {
      e.target.disabled = true;

      try {
        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(
          process.env.REACT_APP_BNPL_CONTRACT_ADDRESS,
          BNPL_ABI,
          signer
        );

        const response = await contract.claimNFTbyBuyer(tokenAddress, tokenId);

        const txConfirm = await provider.getTransaction(response.hash);
        if (txConfirm) toast.loading("Please wait...", { toastId: "claimNFT" });

        const confirmedTransaction = await provider.waitForTransaction(
          response.hash,
          1
        );

        if (confirmedTransaction.status === 1) {
          const loanData = await contract.getLoanData(tokenAddress, tokenId);

          let loanState = loanStates[loanData.state];

          setNftData({
            ...nftData,
            state: loanState,
          });

          axios.patch(`${process.env.REACT_APP_SERVER_URL}/state`, {
            state: loanState,
            owner: owner,
            price: 0,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });

          toast.update("claimNFT", {
            render: "Trasaction completed!!",
            type: "success",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        } else {
          toast.update("claimNFT", {
            render: "Unknown Error occur, while processing transaction!!",
            type: "error",
            isLoading: false,
            closeOnClick: true,
            autoClose: 3000,
          });
        }

        e.target.disabled = true;
      } catch (err) {
        let msg = "Unknown Error occur, while processing transaction!!";
        e.target.disabled = false;

        if (err.code === "ACTION_REJECTED") {
          msg = "Transaction Rejected By User!";
          toast.error(msg);

          return;
        }

        toast.update("claimNFT", {
          render: msg,
          type: "error",
          isLoading: false,
          closeOnClick: true,
          autoClose: 3000,
        });
        console.log("Error : ", err);
      }
    } else {
      toast.error("No wallet Found!", { toastId: "claimNFT" });
    }
  }

  const statesData = [
    {
      state: "LISTED",
      btns: [
        {
          text: "Cancel Listing",
          onclick: cancelListing,
        },
      ],
    },
    {
      state: "MARGIN_LISTED",
      btns: [
        {
          text: "Repay",
          onclick: (e) => {
            handleClick(e, "Repay");
          },
        },
        {
          text: "Cancel Listing",
          onclick: cancelListing,
        },
      ],
    },
    {
      state: "BNPL_LOAN_ACTIVE",
      btns: [
        {
          text: "Repay",
          onclick: (e) => {
            handleClick(e, "Repay");
          },
        },
        {
          text: "List for Margin Sale",
          onclick: (e) => {
            handleClick(e, "Margin_List");
          },
        },
      ],
    },
    {
      state: "LOAN_REPAID",
      btns: [
        {
          text: "Claim NFT",
          onclick: claimNFT,
        },
      ],
    },
    {
      state: "LISTED_CANCELLED",
      btns: [
        {
          text: "List for Sale",
          onclick: (e) => {
            handleClick(e, "List_NFT");
          },
        },
      ],
    },
    {
      state: "MARGIN_LISTED_CANCELLED",
      btns: [
        {
          text: "List For Sale",
          text: "List for Margin Sale",
          onclick: (e) => {
            handleClick(e, "Margin_List");
          },
        },
        {
          text: "Repay",
          onclick: (e) => {
            handleClick(e, "Repay");
          },
        },
      ],
    },
    {
      state: "NFT_CLAIMED",
      btns: [
        {
          text: "List for Sale",
          onclick: (e) => {
            handleClick(e, "List_NFT");
        }
      }
      ],
    }
  ];

  return (
    <div className="h-full">
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
        <div className="flex px-6 text-white mb-0 items-center h-full">
          <div className="item-image flex flex-col border-r border-gray-200 mb-0">
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
                    <div>Loan Amount</div>

                    <div className="text-5xl font-bold">{loanAmount}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto my-8 item-content-buy">
              {statesData
                .find((e) => e.state === nftData.state)
                ?.btns.map((btn, ixd) => (
                  <button
                    key={ixd}
                    className="primary-btn"
                    onClick={btn.onclick}
                  >
                    {btn.text}
                  </button>
                ))}
            </div>
          </div>
          <div id="event_popup" onClick={closePopup}>
            <div
              id="event_popup_detail"
              className="text-white border-2 shadow-lg shadow-cyan-500/50 border-sky-500/70 rounded-md"
            >
              {popup === "Repay" && (
                <div className="h-full flex flex-col justify-center items-center">
                  <p className="text-xl mb-5">
                    <p>Due Amount: {dueAmount} SHM</p>
                  </p>
                  <input
                    className=" mb-5 text-lg text-black px-5 rounded-xl"
                    type="tel"
                    id="repayAmount"
                  />
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700 py-3"></div>
                  ) : (
                    <button
                      className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
                      onClick={(e) => {
                        repayLoan(
                          e,
                          document.getElementById("repayAmount").value
                        );
                        document.getElementById("repayAmount").value = "";
                      }}
                    >
                      Repay
                    </button>
                  )}
                </div>
              )}
              {popup === "Margin_List" && (
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="text-2xl mb-5">
                    Put your NFT for margin sale
                  </div>
                  <input
                    className=" text-lg text-black mb-5 px-5 rounded-xl"
                    type="tel"
                    id="marginPrice"
                  />
                  <button
                    className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
                    onClick={(e) => {
                      marginList(
                        e,
                        document.getElementById("marginPrice").value
                      );
                    }}
                  >
                    List for Sale
                  </button>
                </div>
              )}
              {
                popup === "List_NFT" && (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="text-2xl mb-5">
                      Put your NFT for sale
                    </div>
                    <input
                      className=" text-lg text-black mb-5 px-5 rounded-xl"
                      type="tel"
                      id="listPrice"
                    />
                    <button
                      className="text-[#0ea5e9] bg-gray-800 items-center px-3 py-2 text-lg font-medium text-center border-2 border-gray-900  hover:bg-[#0ea5e9] hover:text-gray-800 mb-4"
                      onClick={(e) => {
                        listNFT(
                          e,
                          document.getElementById("listPrice").value
                        );
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
    </div>
  );
};

export default Item;
