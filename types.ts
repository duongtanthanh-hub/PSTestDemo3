
export interface GeneratedImage {
  year: string;
  description: string;
  src: string; // base64 data URL
}

export interface DecadeConfig {
  year: string;
  prompt: string;
  description: string;
}
