
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { SnapState } from './state';

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

export class KeyPairFactory {
    static fromSeed(seed: Uint8Array): KeyringPair {
        // const keyring = new Keyring();
        // return keyring.addFromSeed(seed);
        return { address: "address!", publicKey: new Uint8Array([48]) } as any;
    }
}