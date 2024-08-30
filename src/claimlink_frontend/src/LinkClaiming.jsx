import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import WalletModal from "./common/WalletModal";
import bgmain1 from "./assets/img/mainbg1.png";
import bgmain2 from "./assets/img/mainbg2.png";
import { MdArrowOutward } from "react-icons/md";
const LinkClaiming = () => {
  const navigate = useNavigate();
  const {
    identity,
    backend,
    principal,
    connectWallet,
    disconnect,
    isConnected,
  } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [principalText, setPrincipalText] = useState("connect wallet");
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[2];
  const nftIndex = pathParts[3];

  useEffect(() => {
    console.log("Canister ID:", canisterId);
    console.log("NFT Index:", nftIndex);
  }, [canisterId, nftIndex]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && principal) {
      setPrincipalText(principal.toText());
    } else {
      setPrincipalText("connect wallet");
    }
  }, [isConnected, principal]);

  useEffect(() => {
    const getNfts = async () => {
      try {
        const canister = Principal.fromText(canisterId);
        const detail = await backend.getNonFungibleTokens(canister);
        console.log("NFTs:", detail);
        setNfts(detail);
      } catch (error) {
        console.log("Error fetching NFTs:", error);
      }
    };

    getNfts();
  }, [backend, canisterId]);

  useEffect(() => {
    const getDeposits = async () => {
      try {
        const detail = await backend.getDeposits();
        console.log("Deposits:", detail);
        setDeposits(detail);
      } catch (error) {
        console.log("Error fetching deposits:", error);
      }
    };

    getDeposits();
  }, [backend]);

  const handleClaim = async () => {
    if (!isConnected) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const canister = Principal.fromText(canisterId);
      const res = await backend?.claimLink(canister, Number(nftIndex));
      console.log("Response of claim:", res);
      if (res == 0) {
        toast.success("NFT claimed successfully!");
        navigate("/");
      } else {
        toast.error("Failed to claim the NFT.");
      }
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Error claiming NFT.");
    } finally {
      setLoading(false);
    }
  };

  const renderNftDetails = () => {
    for (let deposit of deposits) {
      if (deposit.collectionCanister.toText() === canisterId) {
        const matchedNft = nfts.find((nft) => nft[0] === deposit.tokenId);
        if (matchedNft) {
          return (
            <motion.div
              key={deposit.tokenId}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="bg-white px-4 py-4 mt-8 rounded-xl cursor-pointer"
            >
              <img
                width="80px"
                height="80px"
                src={matchedNft[2]?.nonfungible?.thumbnail}
                alt="NFT Thumbnail"
                className="w-16 h-16"
              />
              <h2 className="text-xl black font-bold mt-5">
                {matchedNft[2]?.nonfungible?.name}
              </h2>
              <p className="text-xs gray mt-1">
                {/* {new Date(deposit.timestamp / 1e6).toLocaleString()} */}
              </p>
              <div className="border border-gray-200 my-4 w-full"></div>
              <div className="w-full">
                <div className="flex justify-between mt-2">
                  <p className="text-xs gray">Token ID</p>
                  <p className="text-xs font-semibold">{deposit.tokenId}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-xs gray">Description</p>
                  <p className="text-xs font-semibold">
                    {matchedNft[2]?.nonfungible?.description}
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 my-4"></div>
            </motion.div>
          );
        }
      }
    }

    return (
      <div className=" my-auto mt-16 text-3xl text-red-500  ">
        No matching NFT found.
      </div>
    );
  };

  return (
    <div className=" flex mt-10 w-full justify-center bg-transparent">
      {" "}
      <div
        className="absolute inset-0 bg-black opacity-10 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      <div className=" h-screen overflow-hidden z-10">
        <img
          src={bgmain1}
          alt=""
          className="transition-transform duration-300  h-[90vh] transform hover:scale-105 ease-in"
        />
      </div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card  rounded-xl w-full "
      >
        <div className="flex flex-col w-[400px] justify-center mx-auto">
          <div className="text-4xl mb-8 font-quicksand tracking-wide text-[#2E2C34] flex items-center">
            claimlink
            <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
          </div>
          <div className="flex justify-between gap-4">
            <h1 className=" text-xl font-medium">Claim Your NFT</h1>
            <button
              className="bg-[#F5F4F7] p-2 rounded-md"
              onClick={() => navigate(-1)}
            >
              <RxCross2 className="text-gray-800 w-5 h-5" />
            </button>
          </div>
          {/* <p className="text-gray-500 text-sm mt-2">
            Click the button below to claim your NFT.
          </p> */}
          {renderNftDetails()}
          {deposits.length > 0 ? (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleClaim}
                disabled={loading}
                className={`button px-4 py-2 rounded-md text-white ${
                  loading ? "bg-gray-500" : "bg-[#564BF1]"
                }`}
              >
                {loading ? "Claiming..." : "Claim NFT"}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
      <div className="   h-screen overflow-hidden  z-10 ">
        <img
          src={bgmain2}
          alt=""
          className="transition-transform  h-[90vh] duration-300 transform hover:scale-105 ease-in"
        />
      </div>
      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default LinkClaiming;