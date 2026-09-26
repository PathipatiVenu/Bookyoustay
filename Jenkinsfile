pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t bookyourstay:%BUILD_NUMBER% .'
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                    docker stop bookyourstay || exit /b 0
                    docker rm bookyourstay || exit /b 0
                    docker run -d -p 8070:80 --name bookyourstay bookyourstay:%BUILD_NUMBER%
                '''
            }
        }
    }

    post {
        success {
            echo 'BookYourStay deployed successfully!'
        }

        failure {
            echo 'BookYourStay deployment failed!'
        }
    }
}
