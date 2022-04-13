import Web3 from 'web3'
const HDWalletProvider = require('@truffle/hdwallet-provider')

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  // window.ethereum.request({ method: 'eth_requestAccounts' })
  web3 = new Web3(window.ethereum)
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new HDWalletProvider(
    'grid wing female know guide endorse expire device wink regular fitness skull',
    'https://rinkeby.infura.io/v3/714f34250e1c47648dd171934c55a845'
  )
  web3 = new Web3(provider)
}

export default web3
