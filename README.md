# Murmle

A 2D metaverse platform that enables virtual collaboration and social interaction through customizable spaces and real-time communication.

## Features

- **Virtual Spaces**: Create and customize 2D environments for teams and communities
- **Real-time Communication**: Voice, video, and text chat with proximity-based audio
- **Avatar System**: Personalized avatars that move through virtual spaces
- **Collaborative Tools**: Screen sharing, whiteboards, and interactive objects
- **Room Management**: Public and private spaces with customizable permissions
- **Cross-platform**: Web-based platform accessible from any device

*Note: These are planned features currently in development*

## 🏗️ Architecture

This project is built as a monorepo using modern web technologies:

- **Monorepo**: TurboRepo for efficient build and dependency management
- **Runtime**: Bun for fast JavaScript runtime and package management
- **API Framework**: Hono for lightweight, fast HTTP server
- **Database**: PostgreSQL with type-safe queries
- **Testing**: Test-driven development approach with comprehensive test coverage
- **Frontend**: Modern web technologies for responsive user experience

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- PostgreSQL database instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/murmle.git
cd murmle
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:

4. Build all packages:
```bash
bun run build
```

5. Run tests:
```bash
bun test
```

6. Start the development server:
```bash
bun run dev
```

## 📁 Project Structure

```
murmle/
├── apps/
│   └── http/           # Main API server
├── packages/
│   ├── db/            # Database schema and utilities
│   └── typescript-config
├── tests/             # Test suites
└── turbo.json         # TurboRepo configuration
```

## Development Philosophy

This project follows **Test-Driven Development (TDD)** principles:

- Tests are written before implementation
- Comprehensive test coverage for all features
- Continuous integration ensures code quality
- Database-first approach with robust schema design

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for your changes
4. Implement your feature
5. Ensure all tests pass: `bun test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build all packages
- `bun run test` - Run test suites
- `bun run db:migrate` - Run database migrations
- `bun run db:seed` - Seed database with sample data
- `bun run lint` - Lint codebase
- `bun run type-check` - Run TypeScript type checking

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License - see the LICENSE file for details.
In simple terms:

- ✅ You can use, modify, and share this code
- ✅ You must give proper credit/attribution
- ❌ No commercial use without permission

## Support

If you have questions or need help:

- Open an issue on GitHub

---

Built with too much coffee and not enough sleep!