import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import PhotoPreview from './PhotoPreview';

describe('PhotoPreview', () => {
  const mockOnClick = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders without a preview image', () => {
    render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    // Should show fallback icon
    expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
  });
  
  test('renders with a preview image', () => {
    render(<PhotoPreview photoPreview="data:image/png;base64,test" onClick={mockOnClick} />);
    
    // Should show the avatar image
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });
  
  test('calls onClick handler when clicked', () => {
    render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  test('shows upload icon on hover', () => {
    render(<PhotoPreview photoPreview="" onClick={mockOnClick} />);
    
    // Upload icon should be in the document
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
  });
});
