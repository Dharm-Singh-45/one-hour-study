/// <reference types="jest" />
/// <reference types="jest-puppeteer" />

import { Page, Browser, BrowserContext } from 'puppeteer'

declare global {
  const page: Page
  const browser: Browser
  const context: BrowserContext
}

declare namespace jest {
  interface Matchers<R> {
    toHaveTitle(title: string | RegExp): Promise<R>
    toHaveURL(url: string | RegExp): Promise<R>
  }
}

