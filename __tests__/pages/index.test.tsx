import { render, screen, waitFor } from '@testing-library/react'
import Home from '../../pages/index'
import * as seo from '@/lib/seo'

// Mock Next.js components
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>
  }
})

jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock SEO
jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(),
}))

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

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(seo.generateMetadata as jest.Mock).mockReturnValue({
      title: 'Home - OneHourStudy',
      description: 'Test description',
      keywords: 'test, keywords',
      alternates: {
        canonical: 'https://onehourstudy.com',
      },
      openGraph: {
        type: 'website',
        url: 'https://onehourstudy.com',
        title: 'Home - OneHourStudy',
        description: 'Test description',
        images: [{ url: 'https://onehourstudy.com/image.jpg' }],
        siteName: 'OneHourStudy',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Home - OneHourStudy',
        description: 'Test description',
        images: ['https://onehourstudy.com/image.jpg'],
        creator: '@onehourstudy',
      },
    })
  })

  it('should render home page', async () => {
    render(<Home />)
    await waitFor(() => {
      const oneHourStudyElements = screen.queryAllByText(/OneHourStudy/i)
      const homeTutorElements = screen.queryAllByText(/Home Tutor/i)
      const jodhpurElements = screen.queryAllByText(/Jodhpur/i)
      expect(oneHourStudyElements.length > 0 || homeTutorElements.length > 0 || jodhpurElements.length > 0).toBeTruthy()
    })
  })

  it('should render hero section', async () => {
    render(<Home />)
    await waitFor(() => {
      const oneHourStudyElements = screen.queryAllByText(/OneHourStudy/i)
      const homeTutorElements = screen.queryAllByText(/Home Tutor/i)
      const jodhpurElements = screen.queryAllByText(/Jodhpur/i)
      expect(oneHourStudyElements.length > 0 || homeTutorElements.length > 0 || jodhpurElements.length > 0).toBeTruthy()
    })
  })

  it('should render call-to-action buttons', () => {
    render(<Home />)
    expect(screen.getByText(/Find Your Tutor/i)).toBeInTheDocument()
    expect(screen.getByText(/Join as a Teacher/i)).toBeInTheDocument()
  })

  it('should have correct links for student registration', () => {
    render(<Home />)
    const studentLink = screen.getByText(/Find Your Tutor/i).closest('a')
    expect(studentLink).toHaveAttribute('href', '/student-register')
  })

  it('should have correct links for teacher registration', () => {
    render(<Home />)
    const teacherLink = screen.getByText(/Join as a Teacher/i).closest('a')
    expect(teacherLink).toHaveAttribute('href', '/teacher-register')
  })

  it('should render about section', () => {
    render(<Home />)
    expect(screen.getByText(/About OneHourStudy/i)).toBeInTheDocument()
  })

  it('should render features section', () => {
    render(<Home />)
    expect(screen.getByText(/Why Choose OneHourStudy\?/i)).toBeInTheDocument()
  })

  it('should render testimonials section', () => {
    render(<Home />)
    expect(screen.getByText(/What Our Students Say/i)).toBeInTheDocument()
  })

  it('should render CTA section', () => {
    render(<Home />)
    expect(screen.getByText(/Ready to Start Learning\?/i)).toBeInTheDocument()
  })

  it('should render Navbar and Footer', () => {
    render(<Home />)
    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should call generateMetadata with home', () => {
    render(<Home />)
    expect(seo.generateMetadata).toHaveBeenCalledWith('home')
  })
})

