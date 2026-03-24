import { createHelia } from "helia";
import { httpGatewayRouting } from "@helia/routers";
import { unixfs } from "@helia/unixfs";
import { Libp2pOptions } from "./config/libp2p.js";
import { createLibp2p } from "libp2p";

//import * as dotenv from 'dotenv';
//dotenv.config();

export let heliaState = $state({ helia: null });

export async function initHelia() {
  // ToDo add logic to import privKey if exists
  // if not generate new and store it.
  if (heliaState.helia) {
    return heliaState.helia;
  } else {
    try {
      const libp2pInit = await createLibp2p(Libp2pOptions);
      // Ensures web brosers find and retrive the CID between them while they dial the same gateway
      const routersInit = httpGatewayRouting({
        gateways: ["https://gateway-mx.decentralizedscience.org"],
      });
      const node = await createHelia({
        libp2p: libp2pInit,
        routers: [routersInit],
      });
      const fs = unixfs(node);
      heliaState.helia = { node: node, fs };
      return heliaState.helia;
    } catch (error) {
      console.error("Error setting up helia", error);
    }
  }
}

export async function stopHelia() {
  if (heliaState.helia) {
    await heliaState.helia.node.stop();
    heliaState.helia = null;
  }
}
