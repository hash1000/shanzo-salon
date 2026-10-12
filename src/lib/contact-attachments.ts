export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf,.txt";
const allowedTypes: Record<string, string[]> = {
  jpg: ["image/jpeg"], jpeg: ["image/jpeg"], png: ["image/png"],
  webp: ["image/webp"], pdf: ["application/pdf"], txt: ["text/plain"],
};
export function attachmentError(files: { name: string; size: number; type: string }[]): string | null {
  if (files.length > MAX_ATTACHMENTS) return "Please attach up to 3 files.";
  if (files.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENT_BYTES) return "Attachments must total 5 MB or less.";
  if (files.some(file => !file.size || !allowedTypes[file.name.split(".").pop()?.toLowerCase() ?? ""]?.includes(file.type))) return "Please choose nonempty JPG, PNG, WebP, PDF, or text files.";
  return null;
}
