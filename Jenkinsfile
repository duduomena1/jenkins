pipeline {
  agent any
  stages {
    stage('Check') {
      steps {
        git(url: 'https://github.com/duduomena1/jenkins', branch: 'main')
      }
    }

    stage('listando arquivos') {
      parallel {
        stage('listando arquivos') {
          steps {
            sh 'ls -la'
          }
        }

        stage('build') {
          steps {
            sh 'docker buildx build --add-port 8081:3000 .'
          }
        }

      }
    }

  }
}