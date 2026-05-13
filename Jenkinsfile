pipeline {
    agent any

    stages {

        stage('Clean Environment') {
            steps {
                echo 'Cleaning Docker Environment'

                sh 'docker system prune -f'

                echo 'Environment Cleanup Completed'
            }
        }

        stage('Build App') {
            steps {
                echo 'Starting Docker Build'

                sh 'docker build -t flask-todo-v2 .'

                echo 'Docker Image Build Completed'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Starting Deployment'

                sh 'docker stop todo-container-v2 || true'
                sh 'docker rm todo-container-v2 || true'

                sh 'docker run -d -p 5002:5001 --name todo-container-v2 flask-todo-v2'

                echo 'Application Successfully Deployed'
            }
        }
    }

    post {
        success {
            echo 'Pipeline Executed Successfully'
        }

        failure {
            echo 'Pipeline Failed'
        }

        always {
            echo 'Pipeline Execution Finished'
        }
    }
}
