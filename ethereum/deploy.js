const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledCampaignFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
  'grid wing female know guide endorse expire device wink regular fitness skull',
  'https://rinkeby.infura.io/v3/714f34250e1c47648dd171934c55a845'
)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log('Attempting to deploy from account', accounts[0])
  const result = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ gas: '10000000', from: accounts[0] })

  console.log('Contract deployed to', result.options.address)

  provider.engine.stop()
}

deploy()
