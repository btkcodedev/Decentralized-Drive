import { useState } from "react";
import { ethers } from "ethers";
import "../globals.css";
import Image from "next/image";

interface DisplayProps {
  contract: ethers.Contract | null;
  account: string;
}

const Display: React.FC<DisplayProps> = ({ contract, account }) => {
  const [data, setData] = useState<JSX.Element[]>([]);

  const getdata = async () => {
    let dataArray: string[] = [];
    const Otheraddress = (
      document.querySelector(".address") as HTMLInputElement
    ).value;

    try {
      if (contract) {
        if (Otheraddress) {
          dataArray = await contract.display(Otheraddress);
        } else {
          dataArray = await contract.display(account);
        }

        if (dataArray.length === 0) {
          alert("No image to display");
        } else {
          const images = dataArray.map((item, i) => (
            <a href={item} key={i} target="_blank" rel="noopener noreferrer">
              <Image
                key={i}
                src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
                alt="new"
                className="image-list"
              />
            </a>
          ));
          setData(images);
        }
      } else {
        alert("Contract is not connected");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data. Please try again.");
    }
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <div className="flex flex-col">
        <input type="text" placeholder="Enter Address" className="address" />
        <button className="center button" onClick={getdata}>
          Get Data
        </button>
      </div>
    </>
  );
};

export default Display;
