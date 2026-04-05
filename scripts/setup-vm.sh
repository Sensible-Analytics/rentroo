#!/bin/bash
set -e

echo "Setting up Google Cloud VM for Rentroo deployment..."

sudo apt-get update
sudo apt-get upgrade -y

if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io docker-compose-plugin
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
fi

sudo apt-get install -y curl git htop ncdu ufw

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable

mkdir -p ~/app/data/mongodb
mkdir -p ~/app/data/redis
mkdir -p ~/app/backup
mkdir -p ~/app/logs

sudo apt-get install -y certbot

echo "VM setup complete. Reboot recommended."
echo "Run: sudo reboot"