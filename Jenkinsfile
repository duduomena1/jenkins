pipeline {
    agent any

    stages{
        stage ('Build image') {
            steps {
                script{
                    dockerapp = docker.build("duduomena1/pipeline:${env.BUILD_ID}", '-f ./Dockerfile ./')
                }
            }
        }

        stage('Push Image') {
            steps {
                script{
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        dockerapp.push('latest')
                        dockerapp.push("${env.BUILD_ID}")
                    }
                }
            }
        }
    }
}