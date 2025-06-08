import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import ScammerPhotoUpload from './ScammerPhotoUpload';

// Mock the toast function
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ScammerPhotoUpload', () => {
  const mockSetPhotoPreview = vi.fn();
  const mockSetPhotoFile = vi.fn();
  const mockSetValue = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders upload button when no preview exists', () => {
    render(
      <ScammerPhotoUpload 
        photoPreview="" 
        setPhotoPreview={mockSetPhotoPreview}
        photoFile={null}
        setPhotoFile={mockSetPhotoFile}
      />
    );
    
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
  });
  
  test('renders change button when preview exists', () => {
    render(
      <ScammerPhotoUpload 
        photoPreview="data:image/png;base64,test" 
        setPhotoPreview={mockSetPhotoPreview}
        photoFile={null}
        setPhotoFile={mockSetPhotoFile}
      />
    );
    
    expect(screen.getByText('Change Photo')).toBeInTheDocument();
  });
  
  test('shows description text', () => {
    render(
      <ScammerPhotoUpload 
        photoPreview="" 
        setPhotoPreview={mockSetPhotoPreview}
        photoFile={null}
        setPhotoFile={mockSetPhotoFile}
      />
    );
    
    expect(screen.getByText('Upload a photo of the scammer, if available.')).toBeInTheDocument();
  });
  
  test('opens file dialog when button is clicked', () => {
    const { container } = render(
      <ScammerPhotoUpload 
        photoPreview="" 
        setPhotoPreview={mockSetPhotoPreview}
        photoFile={null}
        setPhotoFile={mockSetPhotoFile}
      />
    );
    
    // Mock the click function of the file input
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    // Click the upload button
    fireEvent.click(screen.getByText('Upload Photo'));
    
    expect(clickSpy).toHaveBeenCalled();
  });
  
  test('updates photo file and preview when valid file is selected', () => {
    // Create a mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onloadend: null as any,
      result: 'data:image/png;base64,mockedbase64',
    };
    
    // Override the global FileReader
    const originalFileReader = global.FileReader;
    global.FileReader = vi.fn(() => mockFileReader) as any;
    
    const { container } = render(
      <ScammerPhotoUpload 
        photoPreview="" 
        setPhotoPreview={mockSetPhotoPreview}
        photoFile={null}
        setPhotoFile={mockSetPhotoFile}
        setValue={mockSetValue}
      />
    );
    
    // Mock a file
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Trigger file selection
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Simulate FileReader completing
    mockFileReader.onloadend();
    
    // Verify that the file and preview were updated
    expect(mockSetPhotoFile).toHaveBeenCalledWith(file);
    expect(mockSetPhotoPreview).toHaveBeenCalledWith('data:image/png;base64,mockedbase64');
    expect(mockSetValue).toHaveBeenCalledWith('photo_url', 'data:image/png;base64,mockedbase64');
    
    // Restore the original FileReader
    global.FileReader = originalFileReader;
  });
});
