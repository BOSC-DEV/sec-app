
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
});
