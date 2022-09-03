import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ethErrors } from 'eth-rpc-errors';
import { RpcParams } from 'snap-adapter';
import { SubstrateApi } from 'substrate-api';
import { Bip44Node } from 'types';

import { generateAccountFromEntropy, recoverAccount, signTx } from './account';
import { SnapState } from './state';

export const getAccountFromSeed = (state: SnapState, params: RpcParams) => {
    console.log(`get_account_from_seed: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: seed');
    }

    try {
        return recoverAccount(state, params[0]);
    } catch (e) {
        console.error('failed to get account from seed', e);
        return null;
    }
}

export const generateAccount = async (state: SnapState, entropy: Bip44Node,) => {
    console.log(`generate_account`);
    try {
        const account = generateAccountFromEntropy(state, entropy);
        return account;
    } catch (e) {
        console.error('failed to generate account', e);
        return null;
    }
}

export const isEnabled = () => true;

export const signTransaction = async (state: SnapState, params: RpcParams, api: SubstrateApi) => {
    console.log(`signing transaction: ${JSON.stringify(params)}`)

    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: transaction');
    }

    try {

        // TODO: this should be params[0]
        const fakeTx = await generateTransactionPayload("5Cz1cP7YzruYZM62T7Q44EgmMbKScJbeDr2w4xzz7wuAsHx8", api.api, "5Cz1cP7YzruYZM62T7Q44EgmMbKScJbeDr2w4xzz7wuAsHx8", 1000);

        //SNAP:
        const { signature } = await signTx(state, fakeTx.payload, api);

        const extrinsic = api.api.createType('Extrinsic', fakeTx.tx);
        extrinsic.addSignature("5Cz1cP7YzruYZM62T7Q44EgmMbKScJbeDr2w4xzz7wuAsHx8", signature, fakeTx.payload);

        const hash = await api.api.rpc.author.submitExtrinsic(extrinsic);
        console.log(hash);
        // END of TODO

        return signature;
    } catch (e) {
        console.error('failed to sign transaction', e);
        return null;
    }
}

export async function generateTransactionPayload(
    address: string, api: ApiPromise, to: string, amount: string | number
): Promise<TxPayload> {
    // fetch last signed block and account address
    const [signedBlock] = await Promise.all([api.rpc.chain.getBlock()]);
    // create signer options
    const nonce = (await api.derive.balances.account(address)).accountNonce;
    const signerOptions = {
        blockHash: signedBlock.block.header.hash,
        era: api.createType('ExtrinsicEra', {
            current: signedBlock.block.header.number,
            period: 50
        }),
        nonce
    };
    // define transaction method
    const transaction: SubmittableExtrinsic<'promise'> = api.tx.balances.transfer(to, amount);

    // create SignerPayload
    const signerPayload = api.createType('SignerPayload', {
        genesisHash: api.genesisHash,
        runtimeVersion: api.runtimeVersion,
        version: api.extrinsicVersion,
        ...signerOptions,
        address: to,
        blockNumber: signedBlock.block.header.number,
        method: transaction.method,
        signedExtensions: [],
        transactionVersion: transaction.version,
    });

    return {
        payload: signerPayload.toPayload(),
        tx: transaction.toHex()
    };
}

export interface TxPayload {
    tx: string;
    payload: any;
}
