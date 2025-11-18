
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Paperclip,
  X
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  onImageSelect?: (file: File) => void;
  imagePreview?: string | null;
  onRemoveImage?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  placeholder = 'Write something...',
  minHeight = '120px',
  onImageSelect,
  imagePreview,
  onRemoveImage
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Format handlers
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    
    // Update the parent component with the new HTML content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Content initialization
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);
  
  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle image selection
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="border rounded-md">
      <div className="p-2 bg-muted/30 border-b flex flex-wrap gap-1">
        <ToggleGroup type="multiple" className="flex flex-wrap">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleFormat('bold')}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleFormat('italic')}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => handleFormat('underline')}>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        {onImageSelect && (
          <>
            <Separator orientation="vertical" className="mx-1 h-8" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImageClick}
              className="h-8 px-2"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="left" aria-label="Align left" onClick={() => handleFormat('justifyLeft')}>
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center" onClick={() => handleFormat('justifyCenter')}>
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right" onClick={() => handleFormat('justifyRight')}>
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <ToggleGroup type="multiple" className="flex flex-wrap">
          <ToggleGroupItem value="list" aria-label="Bullet list" onClick={() => handleFormat('insertUnorderedList')}>
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="orderedList" aria-label="Numbered list" onClick={() => handleFormat('insertOrderedList')}>
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="h1" aria-label="Heading 1" onClick={() => handleFormat('formatBlock', '<h1>')}>
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="h2" aria-label="Heading 2" onClick={() => handleFormat('formatBlock', '<h2>')}>
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="h3" aria-label="Heading 3" onClick={() => handleFormat('formatBlock', '<h3>')}>
            <Heading3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="p" aria-label="Paragraph" onClick={() => handleFormat('formatBlock', '<p>')}>
            <span className="text-xs font-bold">P</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div
        ref={editorRef}
        className="p-3 focus:outline-none"
        style={{ minHeight }}
        contentEditable={true}
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />
      
      {imagePreview && (
        <div className="p-3 border-t">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-xs max-h-48 rounded-md object-cover"
            />
            {onRemoveImage && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={onRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
