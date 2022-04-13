import React, { Component } from 'react'
import { Button, Table, Message } from 'semantic-ui-react'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class RequestRow extends Component {
  state = {
    approveLoading: false,
    approveErrorMessage: '',
    finalizeLoading: false,
    finalizeErrorMessage: ''
  }

  handleApprove = async () => {
    this.setState({ approveLoading: true, approveErrorMessage: '' })
    const campaign = Campaign(this.props.address)
    const accounts = await web3.eth.getAccounts()
    try {
      await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] })
      Router.replaceRoute(Router.asPath)
    } catch (err) {
      this.setState({ approveErrorMessage: err.message })
    }
    this.setState({ approveLoading: false })
  }

  handleFinalize = async () => {
    this.setState({ finalizeLoading: true, finalizeErrorMessage: '' })
    const campaign = Campaign(this.props.address)
    const accounts = await web3.eth.getAccounts()
    try {
      await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] })
      Router.replaceRoute(Router.asPath)
    } catch (err) {
      this.setState({ finalizeErrorMessage: err.message })
    }
    this.setState({ finalizeLoading: false })
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
          {requestComplete
            ? null
            : (
              <div>
                <Button color='green' basic onClick={this.handleApprove} loading={this.state.approveLoading}>
                  Approve
                </Button>
                <Message error hidden={!this.state.approveErrorMessage} header='Error' content={this.state.approveErrorMessage} />
              </div>
              )
          }
        </Table.Cell>
        <Table.Cell>
          {requestComplete
            ? null
            : (
              <div>
                <Button color='teal' basic onClick={this.handleFinalize} loading={this.state.finalizeLoading}>
                  Finalize
                </Button>
                <Message error hidden={!this.state.finalizeErrorMessage} header='Error' content={this.state.finalizeErrorMessage} />
              </div>
              )
          }
        </Table.Cell>

      </Table.Row>
    )
  }
}

export default RequestRow
