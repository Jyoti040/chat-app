import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({title="Chat App",description}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content='This is a chat app'/>
    </Helmet>
  )
}

export default Title