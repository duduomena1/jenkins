#!/bin/bash
# Menu Opção 
echo "Selecione uma opção"
echo "1 - Instalar todos os pacotes"
echo "2 - Instalar Docker"
echo "3 - Instalar kubectl"
echo "4 - Instalar k3d"
echo "5 - Instalar Jenkins"
echo "6 - Instalar Terraform"
echo "7 - Sair"
echo -n "Selecione sua opção [1-7]: "

read choice

# Lendo seleção
case $choice in 
    1)  echo "1 - Instalando todos os pacotes"
        # Instalação do Git
        echo "Instalando Git"
        sudo apt-get update && sudo apt-get install git-all
        
        # Instalação Docker
        echo "Instalando Docker"
        for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do 
            sudo apt-get remove -y $pkg
        done
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        
        # Instalando K3D
        echo "Instalando K3D"
        curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
        
        # Instalando Kubernetes
        echo "Instalando dependências do Kubernetes"
        sudo apt-get update && sudo apt-get install -y curl
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
        echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
        chmod +x kubectl
        mkdir -p ~/.local/bin
        mv ./kubectl ~/.local/bin/kubectl
        
        # Instalação JDK
        sudo apt update
        sudo apt install -y fontconfig openjdk-17-jre
        
        # Instalando Jenkins
        echo "Instalando o Jenkins"
        sudo apt-get install -y gpg
        sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
        echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y jenkins;;
    
    2)  echo "2 - Instalando Docker"
        for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do 
            sudo apt-get remove -y $pkg
        done
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin;;
    
    3)  echo "3 - Instalando kubectl"
        sudo apt-get update && sudo apt-get install -y curl
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
        echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
        chmod +x kubectl
        mkdir -p ~/.local/bin
        mv ./kubectl ~/.local/bin/kubectl;;
    
    4)  echo "4 - Instalando k3d"
        curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash;;
    
    5)  echo "5 - Instalando Jenkins"
        echo "Instalação JDK"
        sudo apt update
        sudo apt install -y fontconfig openjdk-17-jre
        
        # Instalando Jenkins
        echo "Instalando o Jenkins"
        sudo apt-get install -y gpg
        sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
        echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y jenkins;;
    
    6)  echo "6 - Instalando Terraform"
        wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt update && sudo apt install -y terraform;;
    
    7)  echo "7 - Saindo"
        exit;;
    
    *)  echo "Opção inválida. Por favor, selecione uma opção válida.";;
esac
