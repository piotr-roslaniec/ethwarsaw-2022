# Snap Adapter

## Getting Started

In order to use snaps, we need to install [MetaMask Flask](https://metamask.io/flask/) extension:

- Checkout [MetaMask extension](https://github.com/MetaMask/metamask-extension) that support MetaMask Flask: We're currently using tag `v10.14.0-flask.0`
- Copy the .metamaskrc.dist file to .metamaskrc
  - Replace the INFURA_PROJECT_ID value with your own personal Infura Project ID.
- Build the extension locally: `yarn setup && yarn dist --build-type flask`
- Load the unpacked extension (see "custom build" instructions)
  from [here](https://github.com/MetaMask/metamask-extension/tree/eth-denver-2022#other-docs)
