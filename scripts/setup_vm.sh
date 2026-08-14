#!/usr/bin/env bash
# ==============================================================================
# Oracle Cloud Always-Free 1 OCPU / 1 GB RAM VM Setup & Memory Optimizer
# ==============================================================================
set -e

echo "🚀 Starting Oracle Cloud VM optimization for ParaMe Engine..."

# 1. Create a 2GB Swapfile to prevent OOM errors on 1GB RAM VM
if [ ! -f /swapfile ]; then
    echo "📦 Creating 2GB swap file..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swapfile created successfully!"
else
    echo "ℹ️ Swapfile already exists."
fi

# 2. Optimize sysctl swappiness and virtual memory caching
sudo sysctl vm.swappiness=20
sudo sysctl vm.vfs_cache_pressure=50
sudo sysctl net.core.rmem_max=2500000 2>/dev/null || true
sudo sysctl net.core.wmem_max=2500000 2>/dev/null || true

# 3. Update packages and install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker & Docker Compose..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "✅ Docker installed!"
fi

# 4. Open Firewall Ports for HTTP, SSL, and WebRTC UDP Audio
echo "🛡️ Configuring Firewall Ports for WebRTC & HTTP..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 7880/tcp
    sudo ufw allow 7881/tcp
    sudo ufw allow 7882/udp
fi

# Handle Oracle Cloud specific iptables defaults
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 7880 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 7881 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p udp --dport 7882 -j ACCEPT 2>/dev/null || true
sudo netfilter-persistent save 2>/dev/null || true

echo "🎉 VM Optimization Complete! Memory Status:"
free -h

echo ""
echo "🐳 Starting ParaMe Docker services..."
docker compose up -d --build

echo ""
echo "✅ ParaMe stack is starting. Check status with: docker compose ps"
