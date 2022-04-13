import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import Header from './Header'
import Head from 'next/head'

class Layout extends Component {
  render () {
    return (
      <Container>
        <Head>
          <link
            async
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css'
          />
        </Head>
        <Header />
        {this.props.children}
      </Container>
    )
  }
}

export default Layout
