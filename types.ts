
export interface CategorizationResult {
  project: string;
  tags: string[];
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string; // base64 for images, raw text for text files
  previewUrl: string; // object URL for image preview
}
