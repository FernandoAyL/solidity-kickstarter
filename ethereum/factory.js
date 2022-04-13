import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xaC879Fc30c1aA5010A1B60F51880C10cf7053204'
)

export default instance
