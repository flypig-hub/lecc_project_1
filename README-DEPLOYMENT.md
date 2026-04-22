# 🚀 RPG Bank Deployment Guide

## 📋 Overview
This document provides comprehensive deployment instructions for the RPG Bank application using Docker, Docker Compose, and GitHub Actions CI/CD.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                GitHub Actions (CI/CD)                │
│                     ↓                                    │
│              ┌─────────────────────────┐              │
│              │    Nginx (Frontend) │              │
│              │         │              │
│              │    React App         │              │
│              │         │              │
│    ┌───────┴───────┐              │
│    │  Docker Network    │              │
│    │   │              │
│    │   │              │
│    │   ▼              │
│    │  PostgreSQL        │              │
│    │   Redis Cache      │              │
│    │   │              │
│    │   ▼              │
│    │ Spring Boot      │              │
│    │ Backend          │              │
│    └─────────────────┘              │
│                                      │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Prerequisites

### System Requirements
- **Docker**: 20.10+ and Docker Compose 2.0+
- **Node.js**: 18+ (for local development)
- **Git**: For version control
- **Server**: Linux server with SSH access (for production)

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Production Environment Variables
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
PROD_HOST=your.production.server.com
PROD_USER=your_ssh_username
PROD_SSH_KEY=your_ssh_private_key_path
```

## 🐳 Docker Deployment

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/rpg-bank.git
cd rpg-bank

# Create environment file
cp .env.example .env
# Edit .env with your local values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Deployment
```bash
# Clone the repository
git clone https://github.com/your-username/rpg-bank.git
cd rpg-bank

# Set up production environment
export $(cat .env.production)

# Deploy with Docker Compose
docker-compose -f docker-compose.yml up -d

# Health check
curl -f http://localhost/actuator/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The deployment pipeline automatically:

1. **Triggers**: Push to `main` or `develop` branches
2. **Testing**: Runs backend and frontend tests
3. **Building**: Creates optimized Docker images
4. **Pushing**: Uploads images to GitHub Container Registry
5. **Deploying**: Deploys to production server

### Manual Deployment
```bash
# Build and push images
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/rpg-bank-backend:latest ./backend
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/rpg-bank-frontend:latest ./frontend

# Deploy to production
ssh user@your.server.com "cd /opt/rpgbank && docker-compose pull && docker-compose up -d"
```

## 📊 Services Configuration

### Backend Service
- **Port**: 8080
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for session and query caching
- **Health Check**: `/actuator/health`
- **Security**: JWT authentication with ROLE_ADMIN protection

### Frontend Service
- **Port**: 80 (via Nginx)
- **Static Files**: Served by Nginx with gzip compression
- **API Proxy**: Routes `/api/*` to backend
- **Security Headers**: HSTS, XSS protection, CSP

### Database Service
- **Type**: PostgreSQL 15
- **Persistence**: Persistent volumes
- **Backup**: Automated backups recommended
- **Connection**: `rpgbank` database

### Cache Service
- **Type**: Redis 7
- **Persistence**: Persistent volumes
- **Purpose**: Session storage and query result caching

## 🔒 Security Configuration

### Environment Variables Management
- **Development**: Uses `.env` file locally
- **Production**: Uses GitHub Secrets and environment variables
- **Sensitive Data**: Never committed to version control

### Access Control
- **Admin Access**: ROLE_ADMIN required for `/api/admin/*`
- **User Access**: Authenticated users for regular endpoints
- **Database**: Separate admin user with secure password

## 📈 Monitoring & Logging

### Application Metrics
- **Health Endpoints**: `/actuator/health`, `/actuator/info`, `/actuator/metrics`
- **Structured Logging**: JSON format with log rotation
- **Performance Monitoring**: Response times and cache hit rates

### Log Locations
- **Backend**: `/app/logs/rpgbank.log`
- **Nginx**: `/var/log/nginx/access.log`
- **Docker**: Container logs via `docker-compose logs`

## 🚀 Scaling Considerations

### Horizontal Scaling
```yaml
# Docker Compose scaling example
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

### Load Balancer Configuration
```nginx
upstream backend {
    server backend1:8080;
    server backend2:8080;
    server backend3:8080;
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U rpgbank_user -d rpgbank -c "SELECT 1;"
```

#### Backend Issues
```bash
# Check application logs
docker-compose logs backend

# Restart service
docker-compose restart backend

# Check health endpoint
curl -f http://localhost:8080/actuator/health
```

#### Frontend Issues
```bash
# Check Nginx logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Performance Optimization

#### Database Indexes
The application includes optimized indexes for:
- User queries by username and email
- Transaction queries by date and account
- Account queries by user and balance

#### Caching Strategy
- **Redis**: Session storage and frequent query results
- **Application Cache**: Leaderboard and tier information
- **CDN**: Consider CDN for static assets in production

## 📱 Backup & Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U rpgbank_user rpgbank > backup_$DATE.sql
```

### Application Backup
```bash
# Backup Docker volumes
docker run --rm -v rpgbank_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/rpgbank_data_$(date +%Y%m%d).tar.gz .
```

## 🔄 Maintenance

### Zero-Downtime Deployment
```bash
# Blue-green deployment strategy
docker-compose -f docker-compose.blue.yml up -d
# Test new version
# Switch traffic
docker-compose -f docker-compose.green.yml up -d
# Remove old version
docker-compose -f docker-compose.blue.yml down
```

## 📞 Support

### Log Analysis
```bash
# View error logs
docker-compose logs --tail=100 backend | grep ERROR

# Monitor resource usage
docker stats
```

### Performance Tuning
```yaml
# Production docker-compose.yml optimizations
services:
  backend:
    environment:
      - SPRING_JVM_OPTS=-Xmx512m -Xms256m
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

## 🔐 Security Best Practices

### Production Security Checklist
- [ ] Change default passwords
- [ ] Use HTTPS in production
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup encryption

### Environment Security
```bash
# Secure file permissions
chmod 600 .env

# Verify no secrets in code
grep -r "password\|secret\|key" src/ --exclude-dir=node_modules
```

## 📞 Emergency Procedures

### Service Recovery
```bash
# Quick restart all services
docker-compose restart

# Full redeployment
docker-compose down
docker-compose up -d --build
```

### Data Recovery
```bash
# Restore from backup
docker-compose exec postgres psql -U rpgbank_user -d rpgbank < backup_latest.sql

# Verify data integrity
docker-compose exec backend curl -f http://localhost:8080/actuator/health
```

---

## 📞 Additional Resources

### Documentation
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL on Docker](https://hub.docker.com/_/postgres/)
- [Redis on Docker](https://hub.docker.com/_/redis/)

### Monitoring Tools
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [ELK Stack](https://www.elastic.co/elastic-stack/)

---

**🎮 For deployment support, check the GitHub repository or contact the development team.**
