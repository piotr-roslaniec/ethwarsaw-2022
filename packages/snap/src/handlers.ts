import { ethErrors } from 'eth-rpc-errors';
import { RpcParams } from 'snap-adapter';

import { recoverAccount } from './account';
import { SnapState } from './state';

export const getAccountFromSeed = (state: SnapState, params: RpcParams) => {
    console.log(`get_account_from_seed: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: seed');
    }
    return recoverAccount(state, params[0]);
}

export const isEnabled = () => true;