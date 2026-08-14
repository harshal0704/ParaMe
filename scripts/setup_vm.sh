#!/usr/bin/env bash
# ==============================================================================
# Oracle Cloud Always-Free 1 OCPU / 1 GB RAM VM Setup & Memory Optimizer
# ==============================================================================
set -e

echo "🚀 Starting Oracle Cloud 1GB VM optimization for AI Persona & LiveKit..."

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
echo "vm.swappiness = 20" | sudo tee -a /etc/sysctl.conf
echo "vm.vfs_cache_pressure = 50" | sudo tee -a /etc/sysctl.conf

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

echo "🎉 VM Optimization Complete! Free Memory:"
free -h
