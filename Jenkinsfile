pipeline {
  agent any
  stage('Branch indexing: abort') {
            when {
                allOf {
                    triggeredBy cause: "BranchIndexingCause"
                    not { 
                        changeRequest() 
                    }
                }
            }
            steps {
                script {
                    echo "Branch discovered by branch indexing"
                    currentBuild.result = 'SUCCESS' 
                    error "Caught branch indexing..."
                }
            }
        }
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