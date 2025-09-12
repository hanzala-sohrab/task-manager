/**
 * Copies text to clipboard with error handling and fallback
 * @param text The text to copy to clipboard
 * @returns Promise that resolves when text is copied or rejects on error
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Try using the modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      textArea.remove();
      throw new Error('Failed to copy text to clipboard');
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy text to clipboard');
  }
};
