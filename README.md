# Como instalar: 
## Instalando em uma máquina local
### Recursos
 - Debian/Ubuntu OS
 - 3 vCPU
 - 16GB RAM
 - 40gb HDD

## Pre-Requisitos 
 - Jenkins
 - java JDK 17
 - Docker
 - Git
   
## Get Started

### Com o git instalado na máquina local: 

  ` git clone https://github.com/duduomena1/jenkins.git`

Execute o arquivo `Install.sh`  e selecione a opção "5" ou se preferir acesse https://www.jenkins.io/download/ e realize o passo a passo descrito.
  >[!NOTE]
  >Recomenda-se alterar a porta padrão do jenkins para evitar conflitos de aplicações;
  > Utilize `systemctl edit jenkins` .

      [Service]
      Environment="JENKINS_PORT=8081" #Altere a porta "8081" para uma porta disponivel   
Após a instalação Acesse http://localhost:(porta selecionada na etapa anterior)

![unlock jenkins](http://gianfratti.com/wp-content/uploads/2019/05/Jenkins_Install_08.png)

Utilize:
        
        sudo cat /var/lib/jenkins/secrets/initialAdminPassword
Copie a chave gerada e cole no campo "Adminstrator password" para destravar o Jenkins.

# Utilizando o Jenkins com Docker 

 Building...
