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

        stage('Test') {
            steps {
                dir('EmployeeApi') {
                    bat 'dotnet test --no-build'
                }
            }
        }

    }
}