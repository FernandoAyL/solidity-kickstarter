import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'

class RequestRow extends Component {
  handleApprove = async () => {
    const campaign = Campaign(this.props.address)
    const accounts = await web3.eth.getAccounts()
    await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] })
  }

  handleFinalize = async () => {
    const campaign = Campaign(this.props.address)
    const accounts = await web3.eth.getAccounts()
    await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] })
  }

  render () {
    const id = this.props.id
    const requestDescription = this.props.request[0]
    const requestValue = this.props.request[1]
    const requestRecipient = this.props.request[2]
    const requestComplete = this.props.request[3]
    const requestApprovalsCount = this.props.request[4]
    const readyToFinalize = requestApprovalsCount > this.props.approversCount / 2
    return (
      <Table.Row disabled={requestComplete} positive={readyToFinalize && !requestComplete}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{requestDescription}</Table.Cell>
        <Table.Cell>{String(web3.utils.fromWei(requestValue, 'ether'))}</Table.Cell>
        <Table.Cell>{requestRecipient}</Table.Cell>
        <Table.Cell>{`${requestApprovalsCount}/${this.props.approversCount}`}</Table.Cell>
        <Table.Cell>
          {requestComplete ? null : (<Button color='green' basic onClick={this.handleApprove}>Approve</Button>)}
        </Table.Cell>
        <Table.Cell>
          {requestComplete ? null : (<Button color='teal' basic onClick={this.handleFinalize}>Finalize</Button>)}
        </Table.Cell>

      </Table.Row>
    )
  }
}

export default RequestRow
