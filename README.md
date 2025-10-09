# Scribe

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/nadinev6/multi-view-scribe?style=social)](https://github.com/nadinev6/multi-view-scribe)

Scribe is a feature-rich markdown editor that allows you to seamlessly transitions between three distinct viewing modes while leveraging Pollinations.AI-powered image generation with content management features.

## Live Demo

Try Scribe now without installation:

**[Launch Live Demo →](https://nadinev6.github.io/scribe/)**

<div align="center">
<img src="./public/650shots_so.png" alt="Scribe View" height="450" style="margin: 20px;">
</div> 

## Overview

This app is designed for content creators, developers, and writers who need a flexible markdown editing environment. Whether you're drafting documentation, writing blog posts, and/or collaborating, Scribe provides a comprehensive list of tools you need, inlcuding public and private fields.

## Key Features

### Three Viewing Modes

- **Rich Text View**: See your markdown rendered in real-time with beautiful formatting
- **Markdown Source**: Edit raw markdown with a comprehensive formatting toolbar
- **Plain Text View**: Edit, view, and proofread as clean, unformatted text

### AI-Powered Image Generation

Create stunning featured images using AI. Simply describe what you want, and our integration with Pollinations.AI will generate the perfect image for your content in a second.

### Content Management

- **Draft History**: Automatically save your work and restore previous versions
- **Content Sharing**: Generate shareable links for your markdown content
- **Authentication**: Secure sign-in with email/password or Google OAuth
- **Real-time Updates**: See changes immediately across all viewing modes

### Editing Tools

- Comprehensive formatting toolbar with one-click markdown insertion
- Support for headings, lists, code blocks, tables, and more
- LLM icon insertion for AI model references
- GitHub-ready badges and status indicators
- Automatic table of contents generation
- Emoji picker integration
- Export to Markdown, HTML, or Plain Text

### Theme Support

Toggle between light and dark themes to match your preference and reduce eye strain during long editing sessions.

## Built With

Scribe is powered by modern web technologies and innovative services:

### Core Technologies

- **React** - UI framework for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for reliable code
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality React components built with Radix UI
- **Supabase** - Backend-as-a-Service for authentication and database

### Acknowledgements



<div align="center">

<img src="./public/Pollinations.png" alt="Pollinations AI" height="80" style="margin: 20px;">

**Pollinations.AI**
AI-powered image generation
</div>

**KendoReact Components**
Components for the editor toolbar

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nadinev6/pollinations.git
cd pollinations/hacktoberfest-2025/Scribe
```

2. Navigate to the project directory:
```bash
cd scribe
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Usage

### Basic Editing

1. Switch between Rich Text, Markdown Source, and Plain Text views using the tabs
2. Use the toolbar in Markdown Source mode for quick formatting
3. Upload or generate featured images for your content

### Saving and Sharing

1. Sign in to unlock draft history and sharing features
2. Your work is automatically saved as you type
3. Use the Share button to generate a public link to your content
4. Access your draft history to restore previous versions

### Exporting Content

Scribe offers powerful export options for different platforms and use cases. All exports require authentication.

#### Quick File Exports

Download your content as individual files:
- **Markdown (.md)** - Export raw markdown with comments stripped and table of contents processed
- **HTML (.html)** - Export fully rendered HTML with embedded styles, ready to view in any browser

#### Platform Packages

Create complete packages optimized for specific platforms:

**Export for GitHub** - Download a ZIP package containing:
- `README.md` - Your content formatted for GitHub with automatic badges and GitHub-flavored markdown
- `images/` folder - All embedded images organized and ready to commit
- Relative image paths automatically updated to reference the local images folder

**Export for Dev.to** - Download a ZIP package containing:
- `article.md` - Your content with Dev.to frontmatter (title, tags, cover image)
- `images/` folder - All embedded images organized for upload
- Frontmatter automatically generated from your document's first heading

#### Copy to Clipboard

Quickly copy formatted markdown for direct pasting:
- **GitHub README** - Copies markdown formatted for GitHub with TOC and badges
- **Dev.to Blog** - Copies markdown formatted for Dev.to with appropriate syntax

All export options automatically process table of contents placeholders, strip private comments, and collect embedded images for platform packages.

## Advanced Features

<div align="center">
<img src="./public/Screenshot-2.png" alt="Scribe Editor Interface" style="margin: 20px; max-width: 100%;">
</div>

### LLM Icon Integration

Insert icons for popular AI models (ChatGPT, Claude, Gemini, etc.) directly into your markdown using the LLM Icons dropdown.

### GitHub Tools

Access professional documentation tools:
- Insert status badges (build, coverage, license)
- Add table of contents with `{{TOC}}`
- Use GitHub-flavored markdown features

### AI Image Generation

1. Switch to the "Generate with AI" tab
2. Describe the image you want to create
3. Choose from multiple image variations
4. Select the perfect image for your content

<div align="center">
<img src="./public/107shots_so.png" alt="Scribe Editor Interface" style="margin: 20px; max-width: 100%;">
</div>

## Language Support & Proofreading

Scribe provides comprehensive multilingual support with a global language switcher and AI-powered proofreading.


### Language Switcher

A language selector is available in the main header (globe icon) with three options:
- **English** - For English content editing and proofreading
- **中文简体** (Simplified Chinese) - For Simplified Chinese content
- **中文繁體** (Traditional Chinese) - For Traditional Chinese content

The selected language:
- Persists across browser sessions
- Controls the default proofreading language
- Works seamlessly with Chinese IME input across all editing modes

### AI Proofreader

<div align="center">
<img src="./public/16shots_so.png" alt="Scribe Editor Interface" style="margin: 20px; max-width: 100%;">
</div>

The Flash Proofreader uses AI to correct and improve your content:
- **Quick Proofread** - Click "Proofread & Fix" to use your currently selected language
- **Language-Specific** - Click the dropdown arrow to select a specific proofreading variant (US English, UK English, Simplified Chinese, Traditional Chinese)
- Returns corrected text with explanations for all changes
- Works in Plain Text view for distraction-free editing

### Gemini / LLM Proofreader API (env configuration)

Configure these env vars in `.env` (Vite will expose them via `import.meta.env`):

- `VITE_GEMINI_API_URL` - e.g. `https://api.your-llm-provider.example/v1/proofread`
- `VITE_GEMINI_API_KEY` - bearer token for the API (if required)

Example request payload (JSON):

{
	"model": "gemini-2.0-flash",
	"language": "zh-CN",
	"input": "待校对的中文文本",
	"features": { "spell": true, "grammar": true, "style": true }
}

Example response schema:

{
	"original": "...",
	"corrected": "...",
	"suggestions": [ { "range": [start, end], "suggestion": "替换文本", "explanation": "说明" } ]
}

Keep API keys out of source control. Do not commit `.env`.

## Project Structure

```
multi-view-scribe/
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── utils/             # Helper utilities
│   └── integrations/      # Third-party integrations
├── public/                # Static assets
├── supabase/             # Supabase migrations
└── package.json          # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

# Scribe

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/nadinev6/scribe?style=social)](https://github.com/nadinev6/scribe)

## Links

- **Main Repository**: [https://github.com/nadinev6/scribe](https://github.com/nadinev6/scribe)
- **Live Demo**: [https://nadinev6.github.io/scribe](https://github.com/nadinev6/scribe)
- **Hacktoberfest Entry**: [pollinations/hacktoberfest-2025/Scribe](https://github.com/nadinev6/pollinations/tree/add/scribe-hacktoberfest-2025/hacktoberfest-2025/Scribe)
- **Issues**: [https://github.com/nadinev6/scribe/issues](https://github.com/nadinev6/scribe/issues)

#
Made for Hacktoberfest 2025 🎃