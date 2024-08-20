pipeline {
    agent any

    stages{
        stage ('BUILD image') {
            steps {
                script{
                    dockerapp = docker.build("duduomena1/pipeline:${env.BUILD_ID}", '-f ./Dockerfile ./')
                }
            }
        }
    }
}