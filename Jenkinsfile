pipeline {
    agent any

    stages{
        stage ('BUILD image') {
            steps {
                script{
                    dockerapp = docker.build("duduomena1/pipeline", '-f ./mypipeline/Dockerfile ./')
                }
            }
        }
    }
}