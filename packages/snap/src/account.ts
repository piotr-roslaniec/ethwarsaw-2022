
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a, u8aToHex, stringToU8a } from '@polkadot/util';
import { SnapState } from './state';
import { Bip44Node } from './types';
// 0x5a77997dc03461f6ebc99bdb0d657dfec2a08763eaf2ab56046e5870a98f0e33
export interface PrivateAccount extends PublicAccount {
    seed: string;
}

export interface PublicAccount {
    address: string;
    // hex value
    publicKey: string;
}

export const persistAccount = (pair: PrivateAccount, state: SnapState) => {
    const newWalletState = state.wallet.importAccount(pair);
    state.setState(newWalletState);
}

export const recoverAccount = (state: SnapState, seed: string): PublicAccount => {
    const pair = KeyPairFactory.fromSeed(hexToU8a(seed));

    const publicAccount: PublicAccount = { address: pair.address, publicKey: u8aToHex(pair.publicKey) };

    persistAccount({ ...publicAccount, seed }, state);

    return publicAccount;
}

export const generateAccountFromEntropy = (state: SnapState, bip44Node: Bip44Node): PublicAccount => {
    // generate keys
    const seed = bip44Node.key.slice(0, 32);

    const pair = KeyPairFactory.fromSeed(stringToU8a(seed));

    const publicAccount: PublicAccount = { address: pair.address, publicKey: u8aToHex(pair.publicKey) };

    persistAccount({ ...publicAccount, seed }, state);

    return publicAccount;
}


export class KeyPairFactory {

    //TODO: ask guys from aleph or check on ui
    static SS58FORMAT = 42; // default
    static COIN_TYPE = 434; // kusama

    static fromSeed(seed: Uint8Array): KeyringPair {
        const keyring = new Keyring({ ss58Format: KeyPairFactory.SS58FORMAT });
        return keyring.addFromSeed(seed);
    }
}