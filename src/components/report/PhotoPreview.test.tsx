
import React from 'react';
import { render, fireEvent } from '@/utils/testUtils';
import { describe, expect, test, vi } from 'vitest';
import PhotoPreview from './PhotoPreview';

describe('PhotoPreview', () => {
  const mockOnClick = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders without a preview image', () => {
    const { getByTestId } = render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    // Should show fallback icon
    expect(getByTestId('fallback-icon')).toBeInTheDocument();
  });
  
  test('renders with a preview image', () => {
    const { getByAltText } = render(<PhotoPreview photoPreview="data:image/png;base64,test" onClick={mockOnClick} />);
    
    // Should show the avatar image
    expect(getByAltText('Preview')).toBeInTheDocument();
  });
  
  test('calls onClick handler when clicked', () => {
    const { getByRole } = render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    fireEvent.click(getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  test('shows upload icon on hover', () => {
    const { getByTestId } = render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    // Upload icon should be in the document
    expect(getByTestId('upload-icon')).toBeInTheDocument();
  });
});
