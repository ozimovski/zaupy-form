# Zaupy Form - Standalone Whistleblowing Form Application

A secure, standalone Next.js application for handling whistleblowing reports. This application operates independently from the main dashboard and communicates only through API endpoints.

## Features

- 🔐 **Secure & Independent**: No direct database access, API-only communication
- 🎨 **Dynamic Theming**: Company branding and colors applied dynamically
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🗂️ **File Uploads**: Support for multiple file types with validation
- 🔍 **Report Tracking**: Public and private tracking options
- 🌐 **Multi-language Ready**: Built with next-intl for internationalization
- ♿ **Accessible**: WCAG compliant form components
- 🚀 **Performance Optimized**: Lightweight and fast loading

## Architecture

This application follows the separation plan outlined in `WHISTLEBLOWING_FORM_SEPARATION_PLAN.md`:

- **Complete Independence**: No shared dependencies with dashboard
- **API Communication**: All data exchange through HTTP APIs
- **Dynamic Configuration**: Form settings fetched from dashboard API
- **Security First**: Rate limiting, input validation, and secure file handling

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A running instance of the Zaupy Dashboard (for API endpoints)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd zaupy-form
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Create `.env.local` with your configuration:
   ```env
   # Dashboard API Configuration (required)
   DASHBOARD_API_URL=http://localhost:3000
   
   # Default subdomain for local development  
   NEXT_PUBLIC_SUBDOMAIN_FALLBACK=devisium
   
   # Optional: Custom app URL
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Landing page: http://localhost:3001
   - Company form: http://localhost:3001/[subdomain]
   - Development form: http://localhost:3001/devisium

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── [subdomain]/             # Company-specific form pages
│   │   ├── page.tsx             # Main form page
│   │   ├── success/             # Success page after submission
│   │   └── track/               # Report tracking pages
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with security headers
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── form/                    # Form-specific components
│   │   ├── ReportForm.tsx       # Main form component
│   │   ├── FormFields.tsx       # Form input fields
│   │   ├── CategorySelect.tsx   # Category selection
│   │   ├── TrackingOptions.tsx  # Tracking mode selection
│   │   └── FileUploadSection.tsx # File upload component
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Dynamic header with branding
│   │   ├── Footer.tsx           # Company footer
│   │   └── PageLayout.tsx       # Main layout wrapper
│   ├── providers/               # React context providers
│   │   ├── ConfigProvider.tsx   # Configuration context
│   │   └── ThemeProvider.tsx    # Dynamic theming
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx           # Button component
│       ├── Input.tsx            # Input component
│       ├── Textarea.tsx         # Textarea component
│       ├── Select.tsx           # Select component
│       ├── Card.tsx             # Card component
│       ├── Alert.tsx            # Alert component
│       ├── LoadingSpinner.tsx   # Loading component
│       └── FileUpload.tsx       # File upload UI
├── hooks/                       # Custom React hooks
│   ├── useFormConfig.ts         # Configuration fetching hook
│   └── useReportSubmission.ts   # Form submission hook
├── lib/                         # Utility libraries
│   ├── api.ts                   # Dashboard API client
│   ├── validation.ts            # Form validation schemas
│   └── utils.ts                 # Utility functions
└── types/                       # TypeScript type definitions
    └── index.ts                 # All type definitions
```

## API Integration

The application communicates with the dashboard through these endpoints:

### Configuration API
```typescript
GET /api/public/forms/{subdomain}/config
```
Fetches company-specific form configuration including:
- Branding (logo, colors, content)
- Categories and validation rules
- File upload restrictions
- Tracking settings

### Submission API
```typescript
POST /api/public/reports/submit
```
Submits new reports with:
- Form data validation
- File upload handling
- Tracking ID generation

### Tracking API
```typescript
GET /api/public/reports/track/{trackingId}
```
Retrieves report status and updates.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run Jest tests
- `npm run test:e2e` - Run Playwright end-to-end tests

### Adding New Features

1. **UI Components**: Add to `src/components/ui/`
2. **Form Components**: Add to `src/components/form/`
3. **API Endpoints**: Extend `src/lib/api.ts`
4. **Validation**: Update `src/lib/validation.ts`
5. **Types**: Add to `src/types/index.ts`

### Theming

The application supports dynamic theming through CSS custom properties:

```typescript
// Colors are applied dynamically from API configuration
const colors = {
  primary: '#3B82F6',
  accent: '#8B5CF6',
  success: '#10B981',
  error: '#EF4444'
}
```

## Deployment

### Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t zaupy-form .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3001:3000 \
     -e DASHBOARD_API_URL=https://your-dashboard.com \
     zaupy-form
   ```

### Production Environment Variables

```env
# Required
DASHBOARD_API_URL=https://your-dashboard.com
NEXT_PUBLIC_APP_URL=https://forms.yourcompany.com

# Optional
RATE_LIMIT_REQUESTS_PER_MINUTE=10
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_SUBMISSION=5
LOG_LEVEL=info
```

### Subdomain Routing

Configure your DNS and reverse proxy to route subdomains to this application:

```nginx
# Nginx example
server {
    server_name *.yourcompany.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Features

- **No Database Access**: Form app has no direct database connections
- **Input Validation**: Comprehensive validation with Zod
- **Rate Limiting**: Built-in request rate limiting
- **File Security**: File type and size validation
- **CORS Protection**: Proper cross-origin headers
- **Security Headers**: CSP, XSS protection, frame options
- **HTTPS Enforcement**: Secure communication only

## Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Form loads with correct branding
- [ ] All validation works correctly
- [ ] File uploads function properly
- [ ] Success page displays tracking ID
- [ ] Error states are handled gracefully
- [ ] Mobile responsiveness works
- [ ] Different company configurations work
- [ ] Report tracking functionality works

## Troubleshooting

### Common Issues

1. **Configuration not loading**
   - Check `DASHBOARD_API_URL` environment variable
   - Verify API endpoint is accessible
   - Check CORS configuration on dashboard
   - Ensure "devisium" company exists in dashboard for development

2. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check dynamic color application
   - Verify CSS custom properties

3. **File upload problems**
   - Check file size and type restrictions
   - Verify API endpoint handles multipart/form-data
   - Check browser console for upload errors

4. **Tracking not working**
   - Verify tracking API endpoint is configured
   - Check tracking ID format and password (if required)
   - Ensure report exists in dashboard

### Health Check

Visit `/api/health` to check application status and API connectivity.

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation for changes
4. Ensure type safety with TypeScript
5. Test across different company configurations

## License

This project is part of the Zaupy platform. See the main project license for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the separation plan document
- Contact the development team

---

**Note**: This is a standalone application that requires a running Zaupy Dashboard instance to function properly. The application is designed to be completely independent and communicates only through well-defined API endpoints.
