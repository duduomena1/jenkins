pipeline {
  agent any
  stages {
    stage('check') {
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

        stage('deploy ') {
          steps {
            sh 'docker buildx build --add-port 8081:3000'
          }
        }

      }
    }

    stage('install npm') {
      steps {
        sh 'cd /jenkins && npm i && npm run test:unit'
      }
    }

  }
}
