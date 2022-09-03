import { ethErrors } from 'eth-rpc-errors';
import { RpcMethod, RpcParams } from 'snap-adapter';

import * as handlers from './handlers';
import { SnapState } from './state';
import { Bip44Node } from './types';

let entropy: Bip44Node;
let state: SnapState;


type RequestObject = { method: RpcMethod; params: RpcParams };

wallet.registerRpcMessageHandler(async (originString: string, { method, params }: RequestObject) => {
  if (!entropy) {
    entropy = await wallet.request({
      method: 'snap_getBip44Entropy_60', // Ethereum BIP44 node 
    });
  }

  if (!state) {
    state = await SnapState.fromPersisted(entropy);
  }
  try {
    switch (method) {
      case "isEnabled":
        return handlers.isEnabled();

      case "getAccountFromSeed":
        return handlers.getAccountFromSeed(state, params);

      default:
        throw ethErrors.rpc.methodNotFound({ data: { request: { method, params } } });
    }
  } catch (e) {
    console.error("Execution error", e);
    throw e;
  }

});
