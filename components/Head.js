import React from 'react'
import Head from 'next/head'

export default class HeadComponent extends React.Component {
  render() {
    const { title } = this.props
    return (
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
        <meta name="description" content="Distributed Web of Care"/>
        <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="/static/favicon.ico" type="image/x-icon"/>
      </Head>
    )
  }
}

HeadComponent.defaultProps = {
  title: 'Distributed Web of Care'
}