# Deployment Guide for EC2

## Prerequisites

- EC2 instance with Docker and Docker Compose installed
- Domain name pointed to your EC2 instance's public IP
- Ports 80 and 443 open in EC2 Security Group

## Quick Setup

### 1. Install Docker and Docker Compose (if not installed)

```bash
sudo apt-get update

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

sudo apt-get install docker-compose-plugin
```

### 2. Clone and Navigate to Project

```bash
git clone <your-repo>
cd MovieApp-main
```

### 3. Set Up SSL Certificates

#### Option A: Let's Encrypt (Free, Recommended)

```bash
sudo apt-get install certbot

sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./nginx/ssl/key.pem

sudo chmod 644 ./nginx/ssl/cert.pem
sudo chmod 600 ./nginx/ssl/key.pem
```

#### Option B: Self-Signed Certificate (For Testing Only)

```bash
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
cd ../..
```

⚠️ **Warning:** Self-signed certificates will show security warnings in browsers. Use only for testing.

### 4. Build and Run with Docker Compose

```bash
docker-compose up -d --build

docker-compose logs -f

docker-compose ps
```

### 5. Access Your Application

- **HTTPS:** `https://your-domain.com`
- **HTTP:** `http://your-domain.com` (automatically redirects to HTTPS)

### 6. Useful Commands

```bash
docker-compose down

docker-compose restart

docker-compose logs -f nginx
docker-compose logs -f movieapp

docker-compose up -d --build
```

### 7. Auto-Renew Let's Encrypt Certificates

If using Let's Encrypt, set up auto-renewal:

```bash

sudo certbot renew --dry-run

sudo crontab -e

0 0,12 * * * certbot renew --quiet && docker-compose restart nginx
```

### 8. EC2 Security Group Settings

Ensure your EC2 Security Group allows:

- **Inbound Port 80** (HTTP) from `0.0.0.0/0`
- **Inbound Port 443** (HTTPS) from `0.0.0.0/0`
- **Outbound All** (for package downloads, etc.)

### Troubleshooting

- **Container won't start:** Check SSL certificate files exist and have correct permissions
- **502 Bad Gateway:** Check if movieapp container is running: `docker-compose ps`
- **SSL errors:** Verify certificate paths in `nginx/nginx.conf` match mounted volume paths
- **Connection refused:** Verify EC2 Security Group allows ports 80 and 443
