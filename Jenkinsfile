pipeline {
    agent any
 
    environment {
        AWS_REGION = "<AWS_REGION>"
        AWS_ACCOUNT_ID = "<AWS_ACCOUNT_ID>"
        ECR_REPO = "$741960641924.dkr.ecr.ap-south-1.amazonaws.com/devops-app"
        IMAGE_NAME = "devops-app"
        EKS_CLUSTER = "<EKS_CLUSTER_NAME>"
    }
 
    stages {
 
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub (main branch)"
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/sheshanth-ramidi/Project1.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }
 
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image"
                sh '''
                  docker build -t ${IMAGE_NAME}:latest .
                '''
            }
        }
 
        stage('Login to AWS ECR') {
            steps {
                echo "Logging in to AWS ECR"
                sh '''
                  aws ecr get-login-password --region ${AWS_REGION} \
                  | docker login --username AWS --password-stdin ${ECR_REPO}
                '''
            }
        }
 
        stage('Tag & Push Image to ECR') {
            steps {
                echo "Tagging and pushing image to ECR"
                sh '''
                  docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:latest
                  docker push ${ECR_REPO}:latest
                '''
            }
        }
 
        stage('Update kubeconfig') {
            steps {
                echo "Updating kubeconfig for EKS cluster"
                sh '''
                  aws eks update-kubeconfig \
                  --region ${AWS_REGION} \
                  --name ${EKS_CLUSTER}
                '''
            }
        }
 
        stage('Deploy to EKS') {
            steps {
                echo "Deploying application to EKS"
                sh '''
                  kubectl apply -f deployment.yaml
                  kubectl apply -f service.yaml
                '''
            }
        }
    }
 
    post {
        success {
            echo "CI/CD Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Please check logs."
        }
    }
}
