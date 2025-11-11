/// <reference types="jest" />
/// <reference types="jest-environment-puppeteer" />

import { Page, Browser } from 'puppeteer';

declare global {
  const page: Page;
  const browser: Browser;
}

export {};

