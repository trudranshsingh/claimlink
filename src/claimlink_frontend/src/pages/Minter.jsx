import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchMinterData } from "../redux/features/minterSlice";
import { useAuth } from "../connect/useClient";
import { Principal } from "@dfinity/principal";
import { useParams } from "react-router-dom";
import CollectionCard from "../common/CollectionCard";
import ScrollToTop from "../common/ScroolToTop";
const Minter = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();
  const { id } = useParams();
  const [copy, setCopy] = useState();
  const [page, setpage] = useState(1);
  const createContract = () => {
    navigate("/minter/new-contract");
  };
  const openmynft = () => {
    navigate(`/minter/${collections[0][0][0].toText()}/token-home`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserCollectionDetails();
        setCollections(data[0]);
        console.log("collection is", data[0]);
        // const principal = Principal.fromUint8Array(
        //   collections?.[0]?.[1]?.[0]?._arr
        // );
        // const principalText = principal.toText();

        console.log("prin is", data[0][0][1].toText());
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);
  const getNonfungibleTokensNft = async () => {
    try {
      let idd = Principal.fromText(id);
      console.log("HELLO FROM THE NON  FUNGIBLE ");
      const res = await backend.getNonFungibleTokens(idd);
      setCopy(res.length());
    } catch (error) {
      console.log("Error getting nfts ", error);
    } finally {
    }
  };

  function formatTimestamp(timestamp) {
    // Convert nanoseconds to milliseconds by dividing by 1,000,000
    const milliseconds = Number(timestamp / 1000000n);

    // Create a new Date object with the milliseconds
    const date = new Date(milliseconds);

    // Extract the components of the date
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date as "Month Day, Year Hour:Minute"
    return `${month} ${day},   ${hours}:${minutes}`;
  }
  return (
    <>
      <ScrollToTop />
      <div className=" p-6 min-h-full">
        {window.innerWidth < 640 ? (
          <div>
            {" "}
            <div className="flex justify-between items-center">
              <h2 className=" text-lg text-[#2E2C34]  font-bold">
                {" "}
                My NFT contracts
              </h2>
              <button
                onClick={createContract}
                className="flex items-center text-sm  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="md:text-2xl text-sm" /> New contract
              </button>
            </div>
            {
              <>
                {loading
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                      <div
                        className="bg-white px-4 py-4 my-4 rounded-xl flex flex-col cursor-pointer"
                        key={index}
                      >
                        <div className="flex justify-start  space-x-4 animate-pulse">
                          <img
                            src="https://via.placeholder.com/100"
                            alt="Campaign"
                            className="w-12 h-12 object-cover rounded-md"
                            style={{
                              border: "2px solid white",
                              zIndex: 3,
                            }}
                          />
                          <img
                            src="https://via.placeholder.com/100"
                            alt="Campaign"
                            className="w-12 h-12 object-cover rounded-md"
                            style={{
                              border: "2px solid white",
                              zIndex: 2,
                              marginLeft: -24,
                            }}
                          />
                          <img
                            src="https://via.placeholder.com/100"
                            alt="Campaign"
                            className="w-12 h-12 object-cover rounded-md"
                            style={{
                              border: "2px solid white",
                              zIndex: 1,
                              marginLeft: -24,
                            }}
                          />
                        </div>
                        <h2 className="text-lg  font-semibold text-[#2E2C34] mt-3 animate-pulse w-20 h-8 bg-gray-200"></h2>
                        <p className=" animate-pulse  w-20 h-4  rounded-sm bg-gray-200 mt-2"></p>
                        <div className="border border-gray-300 my-4 w-full"></div>
                        <div className="mt-2 w-full">
                          <div className="flex justify-between">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                            <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          </div>
                        </div>
                      </div>
                    ))
                  : collections?.map((collection, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="bg-white  py-4 mt-6 rounded-xl flex flex-col shadow-md"
                        onClick={() => {
                          navigate(
                            `/minter/${collection[1]?.toText()}/token-home`
                          );
                        }}
                      >
                        <div className="px-4">
                          <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-3">
                              <img
                                width="80px"
                                height="80px"
                                src={collection[4]}
                                alt="Dispenser"
                                className="rounded-lg"
                              />
                              <div className="">
                                <h2 className="md:text-lg text-sm font-semibold text-[#2E2C34]  ">
                                  {collection[2]}
                                </h2>
                                <p className="text-[#84818A] md:text-sm text-xs ">
                                  April 5, 13:34
                                </p>
                              </div>
                            </div>
                            <div>
                              <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                            </div>
                          </div>
                          <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                          <div className=" w-full">
                            <div className="flex w-full justify-start relative">
                              <div className="w-1/2 p-2 flex justify-start">
                                <div className="flex flex-col justify-start">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    Address
                                  </p>
                                  <p className="text-[#564BF1] font-semibold text-sm">
                                    {collection[1]?.toText()}
                                  </p>
                                </div>
                              </div>
                              <div className="w-1/2 p-2 flex flex-col justify-start relative">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                                <div className="flex flex-col justify-start pl-4">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    All token copies
                                  </p>
                                  <p className="text-[#2E2C34] font-semibold text-sm">
                                    1
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="border bg-[#EBEAED]  w-full"></div>
                            <div className="flex flex-wrap  relative">
                              <div className="w-1/2 mt-2 flex justify-start">
                                <div className="flex flex-col justify-start">
                                  <p className="text-[#84818A] md:text-sm text-xs">
                                    Token standart
                                  </p>
                                  <p className="text-[#2E2C34] font-semibold text-sm">
                                    EXT
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </>
            }
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg  font-bold text-[#2E2C34]">
                My NFT contracts
              </h2>
              <select
                name="Filter"
                id="filter"
                className="border border-[#564BF1] px-2 py-1 text-[#564BF1] rounded-md outline-none text-sm"
              >
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#E9E8FC] px-4 py-4 rounded-xl flex flex-col h-64 items-center justify-center cursor-pointer"
                onClick={createContract}
              >
                <div className="bg-white p-2 m-2 rounded-md">
                  <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
                </div>
                <h2 className="text-[#564BF1] text-lg  font-bold mt-3 text-center">
                  Deploy new contract
                </h2>
                <p className="text-[#564BF1] text-xs text-center mt-2">
                  Mint a new token.
                </p>
              </motion.div>
              {loading
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                    <div
                      className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                      key={index}
                    >
                      <div className="flex justify-start  space-x-4 animate-pulse">
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Campaign"
                          className="w-12 h-12 object-cover rounded-md"
                          style={{
                            border: "2px solid white",
                            zIndex: 3,
                          }}
                        />
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Campaign"
                          className="w-12 h-12 object-cover rounded-md"
                          style={{
                            border: "2px solid white",
                            zIndex: 2,
                            marginLeft: -24,
                          }}
                        />
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Campaign"
                          className="w-12 h-12 object-cover rounded-md"
                          style={{
                            border: "2px solid white",
                            zIndex: 1,
                            marginLeft: -24,
                          }}
                        />
                      </div>
                      <h2 className="text-lg  font-semibold text-[#2E2C34] mt-3 animate-pulse w-20 h-8 bg-gray-200"></h2>
                      <p className=" animate-pulse  w-20 h-4  rounded-sm bg-gray-200 mt-2"></p>
                      <div className="border border-gray-300 my-4 w-full"></div>
                      <div className="mt-2 w-full">
                        <div className="flex justify-between">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                          <p className=" animate-pulse  w-20 h-6  rounded-sm bg-gray-200"></p>
                        </div>
                      </div>
                    </div>
                  ))
                : collections?.map((data, index) => (
                    <CollectionCard data={data} />
                  ))}
            </div>
            {/* <div className="flex w-40 border border-blue-300 justify-end items-end">
              {[1, 2, 3, 4, 5, 6].map((data, index) => (
                <div key={index} className="border border-blue-400 px-2 py-1">
                  {data}
                </div>
              ))}{" "}
            </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Minter;
