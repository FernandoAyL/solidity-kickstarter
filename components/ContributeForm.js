import React, { Component } from 'react'

import { Button, Form, Input, Message } from 'semantic-ui-react'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ loading: true, errorMessage: '' })
    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = Campaign(this.props.address)
      await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether') })
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
    this.setState({ loading: false })
  }

  render () {
    return (
      <Form onSubmit={this.handleSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            label='ether'
            labelPosition='right'
            onChange={event => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Button primary loading={this.state.loading}>Contribute!</Button>
        <Message error header='Error' content={this.state.errorMessage} />
      </Form>
    )
  }
}

export default ContributeForm
