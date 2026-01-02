# SSL Certificates

Place your SSL certificates here:

- `cert.pem` - SSL certificate file
- `key.pem` - SSL private key file

## For EC2 with Let's Encrypt (Certbot)

If you're using Let's Encrypt on EC2, you can:

1. Install Certbot on your EC2 instance:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. Get certificates (replace your-domain.com with your actual domain):
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. Copy certificates to this directory:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./nginx/ssl/key.pem
   ```

4. Set proper permissions:
   ```bash
   sudo chmod 644 ./nginx/ssl/cert.pem
   sudo chmod 600 ./nginx/ssl/key.pem
   ```

## For AWS Certificate Manager (ACM)

If using AWS Certificate Manager, you'll need to use AWS Application Load Balancer instead of nginx for SSL termination, or export the certificate and place it here.

