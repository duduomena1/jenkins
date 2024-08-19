import '@/styles/globals.css'
import '@/styles/fonts.css'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import Modal from 'react-modal'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    Modal.setAppElement('#__next')
  }, [router])

  return (
    <>
      <Head>
        <title>Sistema de Diárias e Passagens | FESFSUS</title>
      </Head>
      <ChakraProvider>
        {Component.disableLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </>
  )
}
