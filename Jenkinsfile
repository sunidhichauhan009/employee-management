pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                bat 'dotnet --version'
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
            }
        }

        stage('Backend Restore') {
            steps {
                dir('EmployeeApi') {
                    bat 'dotnet restore'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('EmployeeApi') {
                    bat 'dotnet build --no-restore'
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('EmployeeApi') {
                    bat 'dotnet test --no-build'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('EmployeeFrontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('EmployeeFrontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                    docker build -t employee-backend:%BUILD_NUMBER% EmployeeApi
                    docker build -t employee-frontend:%BUILD_NUMBER% EmployeeFrontend
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        if errorlevel 1 exit /b 1

                        docker tag employee-backend:%BUILD_NUMBER% %DOCKER_USER%/employee-backend:%BUILD_NUMBER%
                        docker tag employee-frontend:%BUILD_NUMBER% %DOCKER_USER%/employee-frontend:%BUILD_NUMBER%

                        docker push %DOCKER_USER%/employee-backend:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/employee-frontend:%BUILD_NUMBER%

                        docker logout
                    '''
                }
            }
        }
    }
}