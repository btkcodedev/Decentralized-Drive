import { ethers } from 'ethers';
import contractABI from './client/src/artifacts/contracts/Upload.sol/Upload.json'; 
import CONTRACT_ADDRESS from "./config";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = `${CONTRACT_ADDRESS}`;
const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

contract.methods.add('0xUserAddress', 'http://example.com').send({ from: '0xYourAddress' })
  .then(result => console.log(result))
  .catch(err => console.error(err));
