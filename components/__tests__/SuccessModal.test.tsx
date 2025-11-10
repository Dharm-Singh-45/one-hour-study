import { render, screen, fireEvent } from '@testing-library/react'
import SuccessModal from '../SuccessModal'

describe('SuccessModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset body overflow style
    document.body.style.overflow = ''
  })

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = ''
  })

  it('should not render when isOpen is false', () => {
    render(<SuccessModal isOpen={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Registration Successful!')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
  })

  it('should display default title and message', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
    expect(screen.getByText(/Thank you for registering with OneHourStudy/)).toBeInTheDocument()
  })

  it('should display custom title and message', () => {
    const customTitle = 'Custom Success Title'
    const customMessage = 'Custom success message'
    
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        title={customTitle}
        message={customMessage}
      />
    )
    
    expect(screen.getByText(customTitle)).toBeInTheDocument()
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('should call onClose when clicking the backdrop', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    
    const backdrop = screen.getByText('Registration Successful!').closest('.fixed')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onClose when clicking the Continue button', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when clicking inside the modal content', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    
    const modalContent = screen.getByText('Registration Successful!').closest('.bg-white')
    if (modalContent) {
      fireEvent.click(modalContent)
      expect(mockOnClose).not.toHaveBeenCalled()
    }
  })

  it('should call onClose when pressing Escape key', () => {
    render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should set body overflow to hidden when modal is open', () => {
    const { rerender } = render(<SuccessModal isOpen={false} onClose={mockOnClose} />)
    expect(document.body.style.overflow).toBe('')
    
    rerender(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore body overflow when modal is closed', () => {
    const { rerender } = render(<SuccessModal isOpen={true} onClose={mockOnClose} />)
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(<SuccessModal isOpen={false} onClose={mockOnClose} />)
    expect(document.body.style.overflow).toBe('')
  })
})

