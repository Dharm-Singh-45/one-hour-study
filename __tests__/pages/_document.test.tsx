import { render } from '@testing-library/react'
import Document from '../../pages/_document'

// Mock Next.js document components
jest.mock('next/document', () => ({
  Html: ({ children, lang }: { children: React.ReactNode; lang: string }) => (
    <html lang={lang}>{children}</html>
  ),
  Head: ({ children }: { children: React.ReactNode }) => <head>{children}</head>,
  Main: () => <main>Main</main>,
  NextScript: () => <script>NextScript</script>,
}))

describe('Document', () => {
  it('should render document component', () => {
    const { container } = render(<Document />)
    expect(container).toBeInTheDocument()
  })

  it('should set html lang to en', () => {
    const { container } = render(<Document />)
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('should render Head component', () => {
    const { container } = render(<Document />)
    const head = container.querySelector('head')
    expect(head).toBeInTheDocument()
  })

  it('should render Main component', () => {
    const { container } = render(<Document />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveTextContent('Main')
  })

  it('should render NextScript component', () => {
    const { container } = render(<Document />)
    const script = container.querySelector('script')
    expect(script).toBeInTheDocument()
  })
})

