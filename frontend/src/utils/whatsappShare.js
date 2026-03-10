/**
 * WhatsApp sharing utility for resume
 * Shares PDF password and download link via WhatsApp
 */

/**
 * Share resume via WhatsApp
 * @param {string} password - PDF password
 * @param {string} userName - User's full name
 * @param {string} downloadLink - Optional download link (if hosted)
 */
export const shareViaWhatsApp = (password, userName, downloadLink = '') => {
  const message = `🔐 *Resume Password*

Hello! Here is the password to open my resume PDF:

👤 *Name:* ${userName}
🔑 *Password:* \`${password}\`

${downloadLink ? `📄 *Download:* ${downloadLink}` : '📄 PDF has been attached separately.'}

Please use this password to open the PDF file. The password format is *FirstName-DDMMYYYY*.

Thank you! 🙏`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Open WhatsApp with pre-filled message
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
};

/**
 * Share resume via WhatsApp to specific phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +1234567890)
 * @param {string} password - PDF password
 * @param {string} userName - User's full name
 * @param {string} downloadLink - Optional download link
 */
export const shareViaWhatsAppToNumber = (phoneNumber, password, userName, downloadLink = '') => {
  // Remove any non-numeric characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  const message = `🔐 *Resume Password*

Hello! Here is the password to open my resume PDF:

👤 *Name:* ${userName}
🔑 *Password:* \`${password}\`

${downloadLink ? `📄 *Download:* ${downloadLink}` : '📄 PDF has been attached separately.'}

Please use this password to open the PDF file. The password format is *FirstName-DDMMYYYY*.

Thank you! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

/**
 * Generate WhatsApp share text only (for copying)
 * @param {string} password - PDF password
 * @param {string} userName - User's full name
 * @returns {string} - Formatted message
 */
export const generateWhatsAppMessage = (password, userName) => {
  return `🔐 Resume Password

Name: ${userName}
Password: ${password}

Please use this password to open the PDF file. Format: FirstName-DDMMYYYY`;
};
