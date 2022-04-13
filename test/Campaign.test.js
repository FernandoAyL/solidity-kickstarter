// contract test code will go here
const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

// const { abi, evm } = require('../compile')

let accounts
let campaign
let campaignFactory
let campaignAddress

const compiledCampaign = require('../ethereum/build/Campaign.json')
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json')

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '10000000' })

  await campaignFactory.methods.createCampaign('100').send({ from: accounts[0], gas: '10000000' });

  [campaignAddress] = await campaignFactory.methods.getDeployedCampaigns().call()
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory', () => {
    assert.ok(campaignFactory.options.address)
  })
  it('deploys a campaign', () => {
    assert.ok(campaign.options.address)
  })
  it('sets caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(accounts[0], manager)
  })
  it('allows people to contribute and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    })
    const isContributor = await campaign.methods.approvers(accounts[1]).call()
    assert(isContributor)
  })
  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '99',
        from: accounts[1]
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })
  it('allows a manager to create a payment request', async () => {
    const campaignDescription = 'Buy batteries'
    await campaign.methods.createPaymentRequest(campaignDescription, '100', accounts[1]).send({
      from: accounts[0],
      gas: '1000000'
    })
    const paymentRequest = await campaign.methods.paymentRequests(0).call()
    assert.equal(campaignDescription, paymentRequest.description)
  })
  it('processes requests', async () => {
    await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether') })
    await campaign.methods.createPaymentRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' })
    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000' })
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' })

    let balance = await web3.eth.getBalance(accounts[1])
    balance = web3.utils.fromWei(balance, 'ether')
    balance = parseFloat(balance)

    assert(balance > 104)
  })
})
