pipeline {
    agent any
 
    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "741960641924.dkr.ecr.ap-south-1.amazonaws.com/devops-app"
    }
 
    stages {
 
        stage('Checkout') {
            steps {
                git 'https://github.com/sheshanth-ramidi/Project1.git'
            }
        }
 
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devops-app .'
            }
        }
 
        stage('Push Image to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
                docker tag devops-app:latest $ECR_REPO:latest
                docker push $ECR_REPO:latest
                '''
            }
        }
 
        stage('Deploy to EKS') {
            steps {
                sh '''
                kubectl apply -f deployment.yaml
                kubectl apply -f service.yaml
                '''
            }
        }
    }
}
