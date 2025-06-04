# Authentik Local Setup

This directory contains the configuration files needed to run Authentik locally using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Make sure Docker and Docker Compose are installed on your system.
2. The `.env` file contains environment variables for Authentik. The secure values have been generated for you.
3. Start Authentik using Docker Compose:

```bash
docker compose up -d
```

4. Access the Authentik web interface at http://localhost:9000
5. The first time you access Authentik, you'll need to create an admin account.

## Configuration

- The default HTTP port is 9000 and HTTPS port is 9443
- PostgreSQL database is used for persistent storage
- Redis is used for caching and session storage
- All data is stored in Docker volumes

## Integrating with Next.js

To integrate Authentik with a Next.js application, you'll need to:

1. Create a provider in Authentik (OAuth2 or OIDC)
2. Configure Next.js to use NextAuth.js with the Authentik provider
3. Set up the appropriate callback URLs and client credentials

## Stopping Authentik

To stop Authentik:

```bash
docker compose down
```

To stop Authentik and remove all data (including the database):

```bash
docker compose down -v
```

## Additional Resources

- [Authentik Documentation](https://goauthentik.io/docs/)
- [Authentik GitHub Repository](https://github.com/goauthentik/authentik)
