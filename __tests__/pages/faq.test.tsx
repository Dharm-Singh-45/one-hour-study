import { render, screen, fireEvent } from '@testing-library/react'
import FAQ from '../../pages/faq'
import * as seo from '@/lib/seo'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

// Mock components
jest.mock('@/components/Navbar', () => {
  return function Navbar() {
    return <nav>Navbar</nav>
  }
})

jest.mock('@/components/Footer', () => {
  return function Footer() {
    return <footer>Footer</footer>
  }
})

// Mock SEO
jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(),
}))

describe('FAQ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(seo.generateMetadata as jest.Mock).mockReturnValue({
      title: 'FAQ - OneHourStudy',
      description: 'Test description',
      keywords: 'test, keywords',
      alternates: {
        canonical: 'https://onehourstudy.com/faq',
      },
      openGraph: {
        type: 'website',
        url: 'https://onehourstudy.com/faq',
        title: 'FAQ - OneHourStudy',
        description: 'Test description',
        images: [{ url: 'https://onehourstudy.com/image.jpg' }],
        siteName: 'OneHourStudy',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'FAQ - OneHourStudy',
        description: 'Test description',
        images: ['https://onehourstudy.com/image.jpg'],
      },
    })
  })

  it('should render FAQ page', () => {
    render(<FAQ />)
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
  })

  it('should render all FAQ categories', () => {
    render(<FAQ />)
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('For Students')).toBeInTheDocument()
    expect(screen.getByText('For Teachers')).toBeInTheDocument()
    expect(screen.getByText('Payment & Plans')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('should render FAQ questions', () => {
    render(<FAQ />)
    expect(screen.getByText(/What is OneHourStudy\?/i)).toBeInTheDocument()
    expect(screen.getByText(/How does OneHourStudy work\?/i)).toBeInTheDocument()
  })

  it('should toggle FAQ answer when clicked', () => {
    render(<FAQ />)
    const questionButton = screen.getByText(/What is OneHourStudy\?/i).closest('button')
    
    if (questionButton) {
      // Initially answer should not be visible
      expect(screen.queryByText(/OneHourStudy is a platform/i)).not.toBeInTheDocument()
      
      // Click to open
      fireEvent.click(questionButton)
      
      // Answer should now be visible
      expect(screen.getByText(/OneHourStudy is a platform/i)).toBeInTheDocument()
      
      // Click again to close
      fireEvent.click(questionButton)
      
      // Answer should be hidden again
      expect(screen.queryByText(/OneHourStudy is a platform/i)).not.toBeInTheDocument()
    }
  })

  it('should open only one FAQ at a time', () => {
    render(<FAQ />)
    const firstQuestion = screen.getByText(/What is OneHourStudy\?/i).closest('button')
    const secondQuestion = screen.getByText(/How does OneHourStudy work\?/i).closest('button')
    
    if (firstQuestion && secondQuestion) {
      // Open first question
      fireEvent.click(firstQuestion)
      expect(screen.getByText(/OneHourStudy is a platform/i)).toBeInTheDocument()
      
      // Open second question
      fireEvent.click(secondQuestion)
      
      // First answer should be closed, second should be open
      expect(screen.queryByText(/OneHourStudy is a platform/i)).not.toBeInTheDocument()
      expect(screen.getByText(/Students can register/i)).toBeInTheDocument()
    }
  })

  it('should render contact support link', () => {
    render(<FAQ />)
    expect(screen.getByText(/Still have questions\?/i)).toBeInTheDocument()
    // Use aria-label to find the link specifically
    const contactLink = screen.getByLabelText(/Contact Support - Get Help from OneHourStudy/i)
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('should render Navbar and Footer', () => {
    render(<FAQ />)
    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should call generateMetadata with faq', () => {
    render(<FAQ />)
    expect(seo.generateMetadata).toHaveBeenCalledWith('faq')
  })
})

