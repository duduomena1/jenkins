pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/duduomena1/jenkins', branch: 'main')
      }
    }

    stage('list') {
      parallel {
        stage('list') {
          steps {
            sh 'ls -la'
          }
        }

        stage('teste front') {
          steps {
            sh 'npm i && npm run test:unit'
          }
        }

      }
    }

  }
}