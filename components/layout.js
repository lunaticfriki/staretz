import React from 'react'
import Head from 'next/head'
import { css, Global } from '@emotion/react'
import { colors } from '../styles/utils'

const Layout = ({ children }) => {
  return (
    <div>
      <Global
        styles={css`
          :root {
            ${colors}
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
          }
          html,
          body {
            line-height: 1.5;
            font-family: Montserrat;
            color: var(--main_dark_blue);
          }
          ul,
          li {
            list-style: none;
          }
          a {
            text-decoration: none;
            color: var(--main_dark_blue);
            &:visited {
              color: var(--main_dark_blue);
            }
            &:hover {
              color: var(--main_pink);
            }
          }
        `}
      />
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
        <title>Staretz</title>
      </Head>
      <header>header</header>
      {children}
      <footer>footer</footer>
    </div>
  )
}

export default Layout
