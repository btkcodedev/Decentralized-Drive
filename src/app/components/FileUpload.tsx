import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "../globals.css";
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from "../../../config";

interface FileUploadProps {
  contract: ethers.Contract | null;
  account: string;
  provider: ethers.providers.Web3Provider | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  contract,
  account,
  provider,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("No image selected");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${PINATA_API_KEY}`,
            pinata_secret_api_key: `${PINATA_SECRET_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract?.add(account, ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
  };

  const retrieveFile = (e: ChangeEvent<HTMLInputElement>) => {
    const data = e.target.files?.[0];
    if (data) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        setFile(data);
      };
      setFileName(data.name);
    }
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="text-black">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
