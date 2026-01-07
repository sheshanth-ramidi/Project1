pipeline {
    agent any
 
    environment {
        AWS_REGION     = "ap-south-1"
        AWS_ACCOUNT_ID = "741960641924"
        ECR_REPO       = "741960641924.dkr.ecr.ap-south-1.amazonaws.com/devops-app"
        IMAGE_NAME     = "devops-app"
        EKS_CLUSTER    = "devops-cluster"   // <-- put your real cluster name
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
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'aws-creds']
                ]) {
                    sh '''
                      aws ecr get-login-password --region ${AWS_REGION} \
                      | docker login --username AWS --password-stdin ${ECR_REPO}
                    '''
                }
            }
        }
 
        stage('Tag & Push Image to ECR') {
            steps {
                echo "Tagging and pushing Docker image to ECR"
                sh '''
                  docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:latest
                  docker push ${ECR_REPO}:latest
                '''
            }
        }
 
        stage('Update kubeconfig') {
            steps {
                echo "Updating kubeconfig for EKS cluster"
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'aws-creds']
                ]) {
                    sh '''
                      aws eks update-kubeconfig \
                      --region ${AWS_REGION} \
                      --name ${EKS_CLUSTER}
                    '''
                }
            }
        }
 
        stage('Deploy to EKS') {
    steps {
        echo "Deploying application to EKS"
        withCredentials([
            [$class: 'AmazonWebServicesCredentialsBinding',
             credentialsId: 'aws-creds']
        ]) {
            sh '''
              kubectl apply -f deployment.yaml
              kubectl apply -f service.yaml
            '''
        }
    }
}
 
    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ CI/CD Pipeline failed. Check logs."
        }
    }
}
