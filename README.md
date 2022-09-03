# ethwarsaw-2022

This repository contains a submission for EthWarsaw 2022 hackathon.

It contains an implementation of a wallet compatible with Aleph Zero protocol. The wallet is implemented using the polkadot.js library and MetaMask snaps plugin system.

## Project Structure

The project is structured as follows:

- `azero-snap` - Contains implementation of the wallet "backend"
- `azero-snap/packages/snap` - The actual snap implementation
- `azero-snap/packages/snap-adapter` - User-facing API for the snap
- `polkadot-apps` - Contains implementation of the wallet "frontend". This yarn workspace is the fork of the [`azero.dev` wallet](https://github.com/Cardinal-Cryptography/apps)

## Usage

To install, run:

```bash
yarn install
```

To run the snap, run:

```bash
yarn build
```

To run wallet locally (in development mode), run:

```bash
yarn start
```
git sta