import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { HasttarProvider } from '../context/HasttarContext'
import { ModalProvider } from 'react-simple-hook-modal'


function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
    >
      <HasttarProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </HasttarProvider>

    </MoralisProvider>

  )
}

export default MyApp
