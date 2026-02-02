# My Little House

A comprehensive backroom web application for "My Little House" English Language Institute. This system manages all aspects of the institute's operations including student management, course administration, financial tracking, and reporting.

## 🚀 Features

### 👥 Student Management

- **Student Registration**: Add new students with comprehensive information (name, contact details, address, birth date, DNI)
- **Student Profiles**: View detailed student information including enrolled courses and payment history
- **Student Editing**: Update student information and contact details
- **Student Deactivation**: Soft delete students while preserving historical data
- **Student Search & Filtering**: Advanced search and filtering capabilities with pagination
- **Student Discounts**: Apply and manage individual student discounts per course
- **Email Integration**: Store and manage student email addresses for communication

### 📚 Course Management

- **Course Creation**: Add new courses with pricing and descriptions
- **Course Editing**: Modify course details, pricing, and observations
- **Course Deactivation**: Soft delete courses while maintaining historical records
- **Course Enrollment**: Enroll students to courses with automatic invoice generation
- **Course Disenrollment**: Remove students from courses with proper cleanup
- **Course Discounts**: Apply percentage-based discounts for individual students

### 💰 Financial Management

- **Invoice Generation**: Automatic monthly invoice creation for enrolled students
- **Invoice Charging**: Process payments for multiple invoices in a single transaction
- **Payment Methods**: Support for cash and bank transfer payments
- **Receipt Generation**: Create detailed payment receipts with itemized charges
- **Receipt Printing**: Print receipts directly from the application
- **Receipt Email**: Send receipts via email with PDF attachment
- **Receipt Copy**: Copy receipt images to clipboard for sharing
- **Invoice Editing**: Modify invoice amounts for enrollment fees
- **Payment Tracking**: Track paid vs unpaid amounts with balance calculations

### 🏦 Cash Register

- **Income Tracking**: Record all incoming payments with detailed categorization
- **Expense Management**: Track all outgoing expenses with descriptions
- **Daily Balance**: View daily cash register balance with initial and final amounts
- **Date-based Filtering**: Filter transactions by specific dates
- **Financial Reports**: Generate comprehensive financial reports

### 📊 Dashboard & Analytics

- **Daily KPIs**: View key performance indicators including total income, cash vs transfer payments
- **Monthly Charts**: Visual representation of monthly income trends
- **Receipt Statistics**: Track number of receipts issued per day
- **Expense Tracking**: Monitor daily expenses and cash flow
- **Year-over-Year Analysis**: Compare financial performance across years

### 📅 Enrollment Management

- **Annual Enrollments**: Manage yearly student enrollments
- **Enrollment Fees**: Set and track enrollment fees per year
- **Enrollment History**: View historical enrollment data
- **Enrollment Editing**: Modify enrollment details and amounts

### ⏰ Expiration Tracking

- **Overdue Invoices**: View and manage overdue invoices
- **Expiration Alerts**: Track invoices approaching expiration dates
- **Payment Reminders**: Identify students with pending payments
- **Expiration Sorting**: Sort invoices by expiration date for priority management

### 📧 Communication

- **Email Integration**: Send payment receipts directly to students via email
- **Receipt Attachments**: Automatically attach receipt images to emails
- **Email Templates**: Professional email formatting for receipts
- **Student Email Management**: Store and update student email addresses

### 🔐 Authentication & Security

- **Google OAuth**: Secure login using Google authentication
- **Email Whitelist**: Restricted access to authorized email addresses
- **Session Management**: Secure session handling with NextAuth
- **Role-based Access**: Control access based on authorized users

### 🎨 User Interface

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components
- **Real-time Updates**: Instant feedback and data updates
- **Search Functionality**: Global search across all modules
- **Data Tables**: Advanced data tables with sorting, filtering, and pagination
- **Form Validation**: Comprehensive form validation with error handling
- **Toast Notifications**: User-friendly success and error notifications

### 📈 Reporting & Export

- **Excel Export**: Export data to Excel format for external analysis
- **Financial Reports**: Generate detailed financial reports
- **Student Reports**: Export student information and payment history
- **Receipt History**: Track and export receipt data

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Charts**: Recharts for data visualization
- **Email**: Nodemailer for email functionality
- **Printing**: React-to-print for receipt printing
- **Image Processing**: Dom-to-image for receipt image generation
- **Form Handling**: React Hook Form with Zod validation
- **Data Tables**: TanStack Table for advanced data display

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd my-little-house
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Configure your environment variables:

```env
POSTGRES_PRISMA_URL=your_postgres_url
POSTGRES_URL_NON_POOLING=your_postgres_direct_url
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODEMAILER_EMAIL=your_email
NODEMAILER_PW=your_email_password
```

5. Run database migrations

```bash
npm run prisma:migrate
```

6. Generate Prisma client

```bash
npm run prisma:generate
```

7. Start the development server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── students/          # Student management
│   ├── courses/           # Course management
│   ├── cash-register/     # Financial tracking
│   ├── receipts/          # Receipt management
│   ├── expirations/       # Overdue invoices
│   └── enrollments/       # Enrollment management
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── students/         # Student-related components
│   ├── courses/          # Course-related components
│   ├── invoices/         # Invoice management
│   ├── receipts/         # Receipt components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions and configurations
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication configuration
│   ├── students.ts       # Student data operations
│   ├── courses.ts        # Course data operations
│   ├── invoices.ts       # Invoice operations
│   └── receipts.ts       # Receipt operations
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format:write` - Format code with Prettier
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client

## 📝 License

This project is private and proprietary to My Little House English Language Institute.

---

**My Little House** - Teaching quality with warmth since 1987
