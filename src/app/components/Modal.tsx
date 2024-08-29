import { useEffect } from "react";
import { ethers } from "ethers";
import "../globals.css";

interface ModalProps {
  setModalOpen: (open: boolean) => void;
  contract: ethers.Contract | null;
}

const Modal: React.FC<ModalProps> = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = (document.querySelector(".address") as HTMLInputElement)
      .value;
    await contract?.allow(address);
    setModalOpen(false);
  };

  // useEffect(() => {
  //   const accessList = async () => {
  //     const addressList = await contract!.shareAccess();
  //     let select = document.querySelector("#selectNumber");
  //     const options = addressList;

  //     for (let i = 0; i < options.length; i++) {
  //       let opt = options[i];
  //       let e1 = document.createElement("option");
  //       e1.textContent = opt;
  //       e1.value = opt;
  //       select!.appendChild(e1);
  //     }
  //   };
  //   contract && accessList();
  // }, [contract]);

  useEffect(() => {
    const accessList = async () => {
      try {
        const accessList = await contract?.shareAccess();
        let select = document.querySelector(
          "#selectNumber"
        ) as HTMLSelectElement;
        select.innerHTML = "";

        accessList.forEach((access: { user: string; access: boolean }) => {
          let el = document.createElement("option");
          el.textContent = access.user;
          el.value = access.user;
          select.appendChild(el);
        });
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            />
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
