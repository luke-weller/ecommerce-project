#!/bin/bash

# Function to handle deployment
deploy_project() {
  echo "Running gulp tasks..."
  gulp deploy # Assuming you have a gulp task named 'build'
  echo "Deploying project..."
  # Add deployment commands here
}

# Function to display help
show_help() {
  echo "Available commands:"
  echo "  deploy    Build and deploy the project"
  echo "  help      Show this help message"
  echo "  exit      Exit the CLI"
}

echo "
 _____                     ____ _     ___ 
| ____|___ ___  _ __ ___  / ___| |   |_ _|
|  _| / __/ _ \|  _   _ \| |   | |    | | 
| |__| (_| (_) | | | | | | |___| |___ | | 
|_____\___\___/|_| |_| |_|\____|_____|___|

Welcome to the EcomCLI. Type 'help' for a list of commands. Use this to aid deployment, testing, and other tasks.
"

# Main loop
while true; do
    echo -n "EcomCLI> "
    read input

    case "$input" in
        deploy)
            deploy_project
            ;;
        help)
            show_help
            ;;
        exit)
            echo "Exiting EcomCLI."
            break
            ;;
        *)
            echo "Unknown command: $input"
            show_help
            ;;
    esac
done
