import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import config from "../utils/helpers/config";
import NetworkWrapper from "../components/wrappers/networkWrapper.component";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const supportedChainIds = [config.chainId];

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>
      <ThirdwebProvider
        walletConnectors={[
          "walletConnect",
          { name: "injected", options: { shimDisconnect: false } },
        ]}
        supportedChains={supportedChainIds}
        desiredChainId={config.chainId}
        dAppMeta={{
          name: "Storehouse",
          description: "to-do",
          isDarkMode: true,
          logoUrl: "/assets/logo.svg",
          url: "https://example.com",
        }}
      >
        <ChakraProvider theme={theme}>
          <NetworkWrapper>
            <Component {...pageProps} />
          </NetworkWrapper>
        </ChakraProvider>
      </ThirdwebProvider>
    </>
  );
}
