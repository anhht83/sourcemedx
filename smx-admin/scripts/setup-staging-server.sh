#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt-get install -y nginx

# Configure nginx for staging
sudo tee /etc/nginx/sites-available/smx-admin-staging << EOF
server {
    listen 80;
    server_name staging.your-domain.com;  # Replace with your staging domain

    location / {
        root /home/ubuntu/smx-admin-staging/frontend/build;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;  # Different port for staging
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the staging site
sudo ln -s /etc/nginx/sites-available/smx-admin-staging /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Create PM2 ecosystem file for staging
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'backend-staging',
      cwd: '/home/ubuntu/smx-admin-staging/backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'staging',
        PORT: 3001
      }
    },
    {
      name: 'frontend-staging',
      cwd: '/home/ubuntu/smx-admin-staging/frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: 'build',
        PM2_SERVE_PORT: 3002,
        PM2_SERVE_SPA: 'true'
      }
    }
  ]
};
EOF

# Install serve for frontend
sudo npm install -g serve

# Save PM2 process list
pm2 save 