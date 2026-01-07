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


## qBittorrent Behind VPN/Gluetun

When running qBittorrent behind a VPN container (like gluetun) or with a self-signed HTTPS certificate, you may encounter authentication or connection issues. Questarr includes several features to address these scenarios:

### Issues and Solutions

**Problem 1: Session Expiration (HTTP 403)**
- qBittorrent may return HTTP 403 when the session expires or authentication is required
- **Solution**: Questarr automatically detects 403 responses, re-authenticates, and retries the request once

**Problem 2: Self-Signed Certificates**
- Internal HTTPS deployments often use self-signed certificates that fail TLS verification
- **Solution**: Enable the `Skip TLS Verify` option in the downloader settings
  - This is **opt-in only** and defaults to `false` for security
  - Only use this for internal, trusted deployments

**Problem 3: Cookie Parsing**
- Some VPN/proxy setups modify cookie headers
- **Solution**: Questarr now parses only the cookie name=value, stripping path/domain/other attributes

**Problem 4: File Upload Format**
- .torrent file uploads require proper multipart/form-data encoding
- **Solution**: Questarr automatically uses multipart/form-data for .torrent files and application/x-www-form-urlencoded for magnet links

### Testing Your Setup

After configuring qBittorrent in Questarr, you can verify the connection from inside the Questarr container:

```bash
# Test authentication
docker exec -it questarr curl -v \
  -d "username=admin&password=yourpassword" \
  http://qbittorrent:8080/api/v2/auth/login

# Test version endpoint (should return version string)
docker exec -it questarr curl -v \
  -H "Cookie: SID=your_session_id_from_above" \
  http://qbittorrent:8080/api/v2/app/version

# For HTTPS with self-signed cert (add -k to skip verification)
docker exec -it questarr curl -vk \
  -d "username=admin&password=yourpassword" \
  https://qbittorrent:8080/api/v2/auth/login
```

### Configuration Tips

1. **URL**: Use the internal Docker network name (e.g., `qbittorrent` or `localhost`) if containers share a network
2. **Port**: Default is 8080 for qBittorrent
3. **Use SSL**: Enable if qBittorrent is configured with HTTPS
4. **Skip TLS Verify**: Only enable for self-signed certificates in trusted internal deployments
5. **Category**: Set to "games" or your preferred category to organize downloads

### Docker Compose Example

```yaml
services:
  questarr:
    image: ghcr.io/doezer/questarr:latest
    # ... other config ...
    
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    network_mode: "service:gluetun"  # Behind VPN
    # ... other config ...
    
  gluetun:
    image: qmcgaw/gluetun:latest
    cap_add:
      - NET_ADMIN
    # ... VPN config ...
```

In this setup, configure Questarr to connect to `gluetun:8080` since qBittorrent's network is routed through gluetun.


## Troubleshooting
See [Troubleshooting on the Wiki](https://github.com/Doezer/Questarr/wiki/Troubleshooting)

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
