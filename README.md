# CRCCF Resume Builder

A complete, production-ready Dynamic Resume Builder Web Application with time-controlled submissions, password-protected PDF generation, email features, and admin panel.

## 🚀 Features

### Resume Builder
- **Dynamic Multi-Section Form**: Personal Info, Education, Work Experience, Skills, Projects, Certifications, Languages, Hobbies, References
- **Real-time Preview**: Live A4-formatted resume preview that updates as you type
- **Add/Remove Entries**: Dynamic sections support unlimited entries
- **Form Validation**: Comprehensive validation with error handling
- **Mobile Responsive**: Fully responsive design for all devices

### Time Control System
- **20-Minute Window**: Resume submissions are time-controlled (20 minutes from deployment)
- **Live Countdown**: Real-time countdown timer with visual indicators
- **Auto-Disable**: Forms automatically disable when time expires
- **Admin Reset**: Admin can reset the timer if needed

### PDF Generation & Security
- **Password Protection**: PDFs are encrypted with secure passwords
- **Password Format**: `FirstName-DDMMYYYY` (e.g., `John-01011995`)
- **High Quality**: Professional A4-formatted PDFs with proper pagination
- **Download & Print**: Multiple options for sharing resumes

### Email & WhatsApp Integration
- **Email Delivery**: Send password-protected PDFs via email
- **WhatsApp Integration**: One-click WhatsApp sharing with password
- **Professional Templates**: Beautiful email templates with instructions
- **Gmail SMTP**: Reliable email delivery via Gmail

### Admin Panel
- **Resume Management**: View, edit, delete submitted resumes
- **Search & Filter**: Find resumes by name or email
- **Statistics**: Dashboard with submission statistics
- **Secure Access**: Password-protected admin interface

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Axios** for API communication
- **html2canvas** + **jsPDF** for PDF generation
- **react-hot-toast** for notifications

### Backend
- **Node.js** + **Express.js** for server
- **MongoDB** + **Mongoose** for database
- **pdf-lib** for PDF encryption
- **Nodemailer** for email functionality
- **Joi** for validation
- **JWT** for authentication (admin panel)

## 📋 Prerequisites

- Node.js 16+ and npm 8+
- MongoDB database (local or cloud)
- Gmail account for email functionality
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/crccf-resume-builder.git
cd crccf-resume-builder
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env with your configuration:
# - MONGO_URI: Your MongoDB connection string
# - EMAIL_USER & EMAIL_PASS: Gmail credentials
# - VITE_ADMIN_PASSWORD: Admin panel password

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Edit .env with your configuration:
# - VITE_API_URL: Backend URL (http://localhost:5000 for development)
# - VITE_ADMIN_PASSWORD: Same as backend admin password

# Start the development server
npm run dev
```

### 4. Access the Application

- **Resume Builder**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use your email and app password in the backend `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-generated-app-password
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your deployed backend URL
   - `VITE_ADMIN_PASSWORD`: Your admin password
4. Deploy!

### Backend (Render)

1. Push your code to GitHub
2. Connect your repository to [Render](https://render.com)
3. Create a new Web Service
4. Configure environment variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `EMAIL_USER` & `EMAIL_PASS`: Gmail credentials
   - `PORT`: 5000 (or your preferred port)
5. Deploy!

### MongoDB Atlas (Cloud Database)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user
4. Get your connection string
5. Add your IP to the whitelist (0.0.0.0/0 for all access)

## 📁 Project Structure

```
crccf-resume-builder/
├── backend/
│   ├── models/          # Mongoose models
│   │   ├── Resume.js
│   │   └── Config.js
│   ├── routes/          # API routes
│   │   ├── resumes.js
│   │   ├── pdf.js
│   │   ├── email.js
│   │   └── timeStatus.js
│   ├── utils/           # Backend utilities
│   │   └── validation.js
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ResumeForm.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── PasswordModal.jsx
│   │   │   ├── EmailModal.jsx
│   │   │   └── CountdownTimer.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── contexts/     # React contexts
│   │   │   ├── TimeContext.jsx
│   │   │   └── ResumeContext.jsx
│   │   ├── utils/        # Frontend utilities
│   │   │   ├── generatePDF.js
│   │   │   └── passwordUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin
VITE_ADMIN_PASSWORD=your-secure-password

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)

```env
# API
VITE_API_URL=https://your-backend.onrender.com

# Admin
VITE_ADMIN_PASSWORD=your-secure-password
```

## 🎯 Usage Guide

### For Users

1. **Fill Your Resume**: Complete all required fields marked with *
2. **Live Preview**: See your resume update in real-time
3. **Download PDF**: Click "Download Resume" to get your password-protected PDF
4. **Save Password**: Note your password format: `FirstName-DDMMYYYY`
5. **Email/Share**: Use email or WhatsApp to share your resume

### For Admins

1. **Access Admin Panel**: Go to `/admin` and enter your admin password
2. **View Resumes**: Browse all submitted resumes with search and pagination
3. **Edit Resumes**: Modify any resume details if needed
4. **Delete Resumes**: Remove inappropriate or duplicate entries
5. **Reset Timer**: Use the time reset feature if needed

## 🔒 Security Features

- **Password Protection**: All PDFs are encrypted with secure passwords
- **Input Validation**: Comprehensive validation prevents malicious input
- **Rate Limiting**: API endpoints are protected against abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Sensitive data is stored securely

## 🐛 Troubleshooting

### Common Issues

1. **Email Not Sending**:
   - Check Gmail app password configuration
   - Verify environment variables are correct
   - Check Gmail SMTP settings

2. **PDF Generation Fails**:
   - Ensure all required fields are filled
   - Check browser console for errors
   - Verify resume preview is visible

3. **Time Control Issues**:
   - Check deployment timestamp in database
   - Verify server time is correct
   - Use admin reset if needed

4. **Database Connection**:
   - Verify MongoDB URI is correct
   - Check network connectivity
   - Ensure IP is whitelisted in MongoDB Atlas

### Getting Help

- Check the browser console for error messages
- Review server logs for backend issues
- Ensure all environment variables are set correctly
- Verify database connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for the database
- [Vercel](https://vercel.com/) for frontend hosting
- [Render](https://render.com/) for backend hosting

## 📞 Support

For support, please contact:
- Email: support@crccf.com
- GitHub Issues: [Create an issue](https://github.com/your-org/crccf-resume-builder/issues)

---

**Built with ❤️ by the CRCCF Resume Builder Team**
