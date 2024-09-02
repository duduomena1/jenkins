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
            sh 'docker build -t next/duduomena .'
          }
        }

      }
    }

  }
}