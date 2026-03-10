const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Enhanced PDF generation with better layout and styling
 */
async function generateSimplePDF(resumeData, password) {
  try {
    console.log('🟢 Enhanced PDF generation started');
    
    // Create new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const { height } = page.getSize();
    let yPosition = height - 50;
    
    // Header with name
    if (resumeData.personalInfo?.fullName) {
      page.drawText(resumeData.personalInfo.fullName.toUpperCase(), {
        x: 50,
        y: yPosition,
        size: 20,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 35;
    }
    
    // Contact info line
    const contactInfo = [];
    if (resumeData.personalInfo?.email) contactInfo.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo?.phone) contactInfo.push(resumeData.personalInfo.phone);
    if (resumeData.personalInfo?.location) contactInfo.push(resumeData.personalInfo.location);
    
    if (contactInfo.length > 0) {
      page.drawText(contactInfo.join(' | '), {
        x: 50,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0.4, 0.4, 0.4)
      });
      yPosition -= 30;
    }
    
    // Horizontal line
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 545, y: yPosition },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7)
    });
    yPosition -= 25;
    
    // Objective
    if (resumeData.objective) {
      page.drawText('OBJECTIVE', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 20;
      
      // Wrap text for objective
      const maxWidth = 495;
      const words = resumeData.objective.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, 11);
        
        if (testWidth > maxWidth && line !== '') {
          page.drawText(line.trim(), {
            x: 50,
            y: yPosition,
            size: 11,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
          });
          line = word + ' ';
          yPosition -= 15;
        } else {
          line = testLine;
        }
      }
      
      if (line.trim()) {
        page.drawText(line.trim(), {
          x: 50,
          y: yPosition,
          size: 11,
          font: font,
          color: rgb(0.3, 0.3, 0.3)
        });
        yPosition -= 25;
      }
    }
    
    // Education Section
    if (resumeData.education?.length > 0) {
      page.drawText('EDUCATION', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 20;
      
      resumeData.education.forEach(edu => {
        if (edu.degree && edu.institution) {
          page.drawText(`${edu.degree} - ${edu.institution}`, {
            x: 50,
            y: yPosition,
            size: 11,
            font: boldFont,
            color: rgb(0.3, 0.3, 0.3)
          });
          yPosition -= 15;
          
          if (edu.duration || edu.year) {
            page.drawText(edu.duration || edu.year || '', {
              x: 50,
              y: yPosition,
              size: 10,
              font: font,
              color: rgb(0.5, 0.5, 0.5)
            });
            yPosition -= 20;
          }
        }
      });
      yPosition -= 10;
    }
    
    // Work Experience Section
    if (resumeData.workExperience?.length > 0) {
      page.drawText('WORK EXPERIENCE', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 20;
      
      resumeData.workExperience.forEach(exp => {
        if (exp.jobTitle && exp.company) {
          page.drawText(`${exp.jobTitle} at ${exp.company}`, {
            x: 50,
            y: yPosition,
            size: 11,
            font: boldFont,
            color: rgb(0.3, 0.3, 0.3)
          });
          yPosition -= 15;
          
          if (exp.duration) {
            page.drawText(exp.duration, {
              x: 50,
              y: yPosition,
              size: 10,
              font: font,
              color: rgb(0.5, 0.5, 0.5)
            });
            yPosition -= 15;
          }
          
          if (exp.description) {
            // Wrap description text
            const maxWidth = 495;
            const words = exp.description.split(' ');
            let line = '';
            
            for (const word of words) {
              const testLine = line + word + ' ';
              const testWidth = font.widthOfTextAtSize(testLine, 10);
              
              if (testWidth > maxWidth && line !== '') {
                page.drawText(line.trim(), {
                  x: 50,
                  y: yPosition,
                  size: 10,
                  font: font,
                  color: rgb(0.4, 0.4, 0.4)
                });
                line = word + ' ';
                yPosition -= 12;
              } else {
                line = testLine;
              }
            }
            
            if (line.trim()) {
              page.drawText(line.trim(), {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0.4, 0.4, 0.4)
              });
              yPosition -= 20;
            }
          }
        }
      });
      yPosition -= 10;
    }
    
    // Skills Section
    if (resumeData.skills?.length > 0) {
      page.drawText('SKILLS', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 20;
      
      const skillsText = resumeData.skills.map(skill => skill.name || skill).join(', ');
      page.drawText(skillsText, {
        x: 50,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });
    }
    
    // Save with password
    const pdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password
    });
    
    console.log('✅ Enhanced PDF generated successfully');
    return pdfBytes;
    
  } catch (error) {
    console.error('❌ Error generating enhanced PDF:', error);
    throw error;
  }
}

module.exports = generateSimplePDF;
