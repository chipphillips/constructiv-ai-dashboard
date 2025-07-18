# Constructiv AI Dashboard

> **Professional AI-powered dashboard for construction industry document extraction and prompt management**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, enterprise-grade dashboard designed specifically for the construction industry, combining AI-powered document extraction capabilities with advanced prompt management. Built with Next.js 15, TypeScript, and Supabase, this platform provides construction professionals with intelligent document processing, visualization, and management tools.

## 🏗️ Key Features

### 📊 **Document Intelligence**
- **AI-Powered Extraction**: Extract company profiles, style guides, personas, and business insights from construction documents
- **Visual Processing**: Generate data visualizations, design details, and visual doodles from technical documents
- **Multi-Format Support**: Process PDFs, Word documents, images, and other construction industry file formats
- **Real-time Analysis**: Instant document processing with live progress tracking

### 🎯 **Prompt Management**
- **Industry-Specific Templates**: Pre-built prompts for construction use cases
- **Custom Prompt Builder**: Create and manage custom AI prompts for specific workflows
- **Version Control**: Track prompt versions and performance metrics
- **Collaboration Tools**: Share and collaborate on prompt development

### 📈 **Professional Dashboard**
- **Real-time Analytics**: Live statistics and performance metrics
- **Interactive Visualizations**: Charts and graphs powered by Recharts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Modes**: Professional theming options

### 🔐 **Enterprise Security**
- **Supabase Authentication**: Secure user management and access control
- **Row-Level Security**: Database-level security policies
- **API Rate Limiting**: Protection against abuse and overuse
- **GDPR Compliance**: Data privacy and protection standards

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Supabase** account and project
- **OpenAI** API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chipphillips/constructiv-ai-dashboard.git
   cd constructiv-ai-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database setup**
   ```bash
   # Test database connection
   npm run test-db
   
   # Generate TypeScript types
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3001](http://localhost:3001)
   - Dashboard will be available immediately

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |
| `npm run test` | Run Jest tests |
| `npm run test-db` | Test database connection |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |

### Code Quality

- **ESLint**: Configured with TypeScript, React, and accessibility rules
- **Prettier**: Automatic code formatting with Tailwind CSS class sorting
- **Husky**: Pre-commit hooks for code quality enforcement
- **TypeScript**: Strict mode enabled for enhanced type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Built with ❤️ for the Construction Industry</strong></p>
  <p>© 2024 Constructiv AI. All rights reserved.</p>
</div>