import type { ReactElement } from 'react'
// @ SEO 적용
import { DefaultSeo } from 'next-seo'

// @ Vercel Analytics로 방문자 수 집계
import { Analytics } from '@vercel/analytics/react'

import type { AppProps } from 'next/app'
import '../style.css'
import '@code-hike/mdx/dist/index.css'

const DEFAULT_SEO = {
  title: 'berenickt',
  description: "berenickt's Dev Blog",
  canonical: 'https://www.carrotins.com',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://berenickt.vercel.app/',
    title: "berenickt - Yewon-Noh's Dev Blog",
    siteName: 'berenickt',
    images: [
      {
        url: '/images/image.png',
        width: 285,
        height: 167,
        alt: '이미지',
      },
    ],
  },
}

export default function Nextra({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
