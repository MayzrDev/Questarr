# Questarr

A video game management application inspired by the -Arr apps (Sonarr, Radarr, Prowlarr...) and GamezServer. Track and organize your video game collection with automated discovery and download management.

## Features

- **Game Discovery**: Browse popular games, new releases, and upcoming titles via IGDB integration
- **Library Management**: Track your game collection with status indicators (Wanted, Owned, Playing, Completed)
- **Download Management**: Optionally integrate with indexers (Prowlarr/Torznab/Newsznab), torrent/usenet downloaders (qBittorrent, Transmission, rTorrent / sabnzbd, nzbget), and optionally enable auto-download to get them right when they're there.
- **Search & Filter**: Find games by genre, platform, and search terms. Automatically search for added games until available on your indexers.
- **Clean Interface**: UI optimized for browsing game covers and metadata, with light/dark mode

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: IGDB (game metadata), Torznab (indexer search)
- **AIs**: Claude Sonnet 4.5, Gemini 3, Google Jules, GitHub Copilot

## Installation

### Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js 20+** and **PostgreSQL 16+**
- **IGDB API credentials** (required for game discovery)

### Using Docker Compose (Recommended)

Docker Compose is the easiest way to deploy Questarr with all dependencies included.

1. **Clone the repository:**
```bash
git clone https://github.com/Doezer/Questarr.git
cd Questarr
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Configure environment variables in `.env`:**
```env
# Required: IGDB API credentials (get from https://dev.twitch.tv/console)
IGDB_CLIENT_ID=your_client_id_here
IGDB_CLIENT_SECRET=your_client_secret_here

# Optional: Server configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

# Database (already configured for Docker)
DATABASE_URL=postgresql://postgres:password@db:5432/questarr
```

1. **Build and start the containers:**
```bash
docker-compose up -d
```

1. **Access the application:**
Open your browser to `http://localhost:5000`

1. **First-time setup:**
- Create your admin account on first visit
- Configure indexers
- Add downloaders

**Update to latest version:**
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Manual Installation (npm)

For development or custom deployments without Docker.

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Doezer/Questarr.git
cd Questarr
npm install
```

2. **Set up PostgreSQL:**
- Install PostgreSQL 16+ on your system
- Create a database: `createdb questarr`
- Create a `.env` file with your database connection string

3. **Configure environment variables in `.env`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/questarr
IGDB_CLIENT_ID=your_client_id
IGDB_CLIENT_SECRET=your_client_secret
PORT=5000
```

4. **Initialize the database:**
```bash
npm run db:migrate
```

5. **Build and start:**

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

6. **Access the application:**
Open your browser to `http://localhost:5000`

## Configuration

See [Configuration on the Wiki](https://github.com/Doezer/Questarr/wiki/Configuring-the-application#configure-app-behavior-in-settings--general) for more detailed info.

### Getting IGDB API Credentials

IGDB provides game metadata (covers, descriptions, ratings, release dates, etc.).

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Log in with your Twitch account (create one if needed)
3. Click "Register Your Application"
4. Fill in:
   - **Name**: Questarr (or any name)
   - **OAuth Redirect URLs**: `http://localhost` (not used, but required)
   - **Category**: Application Integration
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**
7. Add them to your `.env` file


## Troubleshooting
See [Troubleshooting on the Wiki](https://github.com/Doezer/Questarr/wiki/Troubleshooting)

### qBittorrent Behind VPN/gluetun

If you're running qBittorrent behind a VPN container (like gluetun), you may need to configure additional settings:

#### Skip TLS Verification (for self-signed certificates)

When qBittorrent uses HTTPS with a self-signed certificate, enable the `Skip TLS Verify` option in the downloader settings:

1. Go to **Settings > Downloaders**
2. Edit your qBittorrent downloader
3. Enable **Skip TLS Verify** checkbox
4. Save the settings

**Security Note**: Only use this option for internal/private networks with self-signed certificates. Never use it for public/internet-facing services.

**Alternative**: If the `Skip TLS Verify` option doesn't work in your environment, you can set the environment variable:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```
This is a global setting and should only be used for testing.

#### Network Configuration

Questarr must be able to reach qBittorrent's network:

**Option 1: Share network namespace** (Recommended)
```yaml
# docker-compose.yml
services:
  questarr:
    network_mode: "container:gluetun"
    # OR
    network_mode: "service:gluetun"
```

**Option 2: Use Docker network**
```yaml
services:
  gluetun:
    networks:
      - mynetwork
  qbittorrent:
    network_mode: "service:gluetun"
  questarr:
    networks:
      - mynetwork
networks:
  mynetwork:
```

#### Testing Connectivity

Test qBittorrent connectivity from within the Questarr container:

```bash
# Get a shell in the Questarr container
docker exec -it questarr sh

# Test HTTP connectivity
curl -v http://qbittorrent:8080/api/v2/app/version

# Test HTTPS connectivity (with self-signed cert)
curl -k -v https://qbittorrent:8080/api/v2/app/version

# Test authentication
curl -v -X POST http://qbittorrent:8080/api/v2/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=adminpass"

# Look for Set-Cookie in the response headers
```

#### Common Issues

**403 Forbidden errors**: Questarr automatically detects session expiration and re-authenticates. Check logs for re-authentication messages.

**Connection refused**: Verify network configuration and that qBittorrent is accessible from Questarr's network namespace.

**SSL/TLS errors**: Enable `Skip TLS Verify` option for self-signed certificates.

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/Doezer/Questarr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Doezer/Questarr/discussions)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

GPL3 License - see [COPYING](COPYING) file for details.

## Acknowledgments

- Inspired by [Sonarr](https://sonarr.tv/) and [GamezServer](https://github.com/05sonicblue/GamezServer)
- Game metadata powered by [IGDB API](https://www.igdb.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
