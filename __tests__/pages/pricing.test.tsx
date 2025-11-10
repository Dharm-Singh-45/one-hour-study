import { render, screen } from '@testing-library/react'
import Pricing from '../../pages/pricing'
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

describe('Pricing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(seo.generateMetadata as jest.Mock).mockReturnValue({
      title: 'Pricing - OneHourStudy',
      description: 'Test description',
      keywords: 'test, keywords',
      alternates: {
        canonical: 'https://onehourstudy.com/pricing',
      },
      openGraph: {
        type: 'website',
        url: 'https://onehourstudy.com/pricing',
        title: 'Pricing - OneHourStudy',
        description: 'Test description',
        images: [{ url: 'https://onehourstudy.com/image.jpg' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Pricing - OneHourStudy',
        description: 'Test description',
        images: ['https://onehourstudy.com/image.jpg'],
      },
    })
  })

  it('should render pricing page', () => {
    render(<Pricing />)
    expect(screen.getByText(/Choose Your Plan/i)).toBeInTheDocument()
  })

  it('should render student plans section', () => {
    render(<Pricing />)
    expect(screen.getByText(/Plans for Students/i)).toBeInTheDocument()
  })

  it('should render teacher plans section', () => {
    render(<Pricing />)
    expect(screen.getByText(/Plans for Teachers/i)).toBeInTheDocument()
  })

  it('should render all student plans', () => {
    render(<Pricing />)
    // Plans might appear multiple times (student and teacher), so use getAllByText
    expect(screen.getAllByText('Basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Standard').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Premium').length).toBeGreaterThan(0)
  })

  it('should render student plan prices', () => {
    render(<Pricing />)
    // Prices might appear multiple times, so use getAllByText
    expect(screen.getAllByText('999').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1,799').length).toBeGreaterThan(0)
    expect(screen.getByText('2,999')).toBeInTheDocument()
  })

  it('should render teacher plan prices', () => {
    render(<Pricing />)
    // Prices might appear multiple times, so use getAllByText
    expect(screen.getAllByText('499').length).toBeGreaterThan(0)
    expect(screen.getAllByText('999').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1,799').length).toBeGreaterThan(0)
  })

  it('should mark featured plan', () => {
    render(<Pricing />)
    expect(screen.getAllByText('Most Popular').length).toBeGreaterThan(0)
  })

  it('should render plan features', () => {
    render(<Pricing />)
    expect(screen.getByText(/8 hours of tutoring per month/i)).toBeInTheDocument()
    expect(screen.getByText(/16 hours of tutoring per month/i)).toBeInTheDocument()
  })

  it('should have correct links for student registration', () => {
    render(<Pricing />)
    const studentLinks = screen.getAllByText('Get Started')
    // All student plan links should point to student-register
    studentLinks.forEach(link => {
      const parent = link.closest('a')
      if (parent && parent.getAttribute('href')?.includes('student-register')) {
        expect(parent).toHaveAttribute('href', '/student-register')
      }
    })
  })

  it('should have correct links for teacher registration', () => {
    render(<Pricing />)
    const teacherLinks = screen.getAllByText('Get Started')
    // At least one teacher plan link should point to teacher-register
    const teacherLink = teacherLinks.find(link => {
      const parent = link.closest('a')
      return parent?.getAttribute('href')?.includes('teacher-register')
    })
    if (teacherLink) {
      expect(teacherLink.closest('a')).toHaveAttribute('href', '/teacher-register')
    }
  })

  it('should render Navbar and Footer', () => {
    render(<Pricing />)
    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should call generateMetadata with pricing', () => {
    render(<Pricing />)
    expect(seo.generateMetadata).toHaveBeenCalledWith('pricing')
  })
})

