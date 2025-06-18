import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { ethers } from "ethers";

// This connects IRYS using the current wallet
export const connectIrys = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const irys = await WebUploader(WebEthereum).withAdapter(
    EthersV6Adapter(provider)
  );
  return irys;
};

// This uploads an event object to IRYS
export const uploadEventToIrys = async (irys, eventObject) => {
  const payload = JSON.stringify(eventObject);
  const result = await irys.upload(payload);
  return result.id; // Irys tx_id
};
