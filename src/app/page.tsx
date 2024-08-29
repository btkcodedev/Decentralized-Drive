"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "@fontsource/poppins";
import Upload from "../../client/src/artifacts/contracts/Upload.sol/Upload.json";
import { CONTRACT_ADDRESS } from "../../config";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider | any;
  }
}

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = `${CONTRACT_ADDRESS}`;
          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(contract);

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          try {
            const tx = await contract.allow(CONTRACT_ADDRESS);
            await tx.wait();
            console.log("Transaction successful!");
          } catch (error) {
            if ((error as any).code === "ACTION_REJECTED") {
              console.error("Transaction was rejected by the user.");
              alert("You rejected the transaction.");
            } else {
              console.error("An unexpected error occurred:", error);
            }
          }
        } catch (error) {
          console.error("Failed to load blockchain data:", error);
        }
      } else {
        console.error("Please install MetaMask");
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <div
      className="flex flex-col font-poppins bg-gray-100 text-black w-full min-h-screen "
      style={{ height: "100vh" }}
    >
      <header className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-md shadow-md z-50">
        <div className="mx-auto px-4 py-4 flex space-between items-center align-middle flex-row">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-left font-poppins">
              Decentralized File Upload & Share
            </h1>
            <p className="text-sm text-gray-600 truncate max-w-[300px]">
              {account ? `Account: ${account}` : "Wallet not connected"}
            </p>
          </div>

          <div className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
            <button onClick={() => setModalOpen(true)}>Share</button>
          </div>
        </div>
      </header>

      <main className="flex flex-grow flex-col max-h-fit mx-auto px-4 pt-48 pb-16 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 justify-start items-start align-middle">
          <Display contract={contract} account={account} />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 rounded-lg overflow-hidden">
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} Decentralized File Upload & Share,
            GPL-3.0 Licensed.
          </p>
          <p>
            Powered by Pinata, Next.js, Tailwind and Solidity on Ethereum Chain
          </p>
        </div>
        {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
      </footer>
    </div>
  );
}
