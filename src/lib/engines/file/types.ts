export interface FileLike extends Blob {
  name: string;
  lastModified: number;
}

export interface FileValidationOptions {
  allowedTypes?: string[];
  maxSizeBytes?: number;
  allowEmpty?: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

export type FileReadProgress = (percent: number) => void;
