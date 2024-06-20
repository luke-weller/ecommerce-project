#!/bin/bash

# Function to handle deployment
build_project() {
    gulp build
}

deploy_project() {
    gulp build && gulp deploy
}

synth_project() {
    gulp build && gulp synth
}

destroy_project() {
    gulp destroy
}


# Function to display help
show_help() {
  echo "Available commands:"
  echo "  build     Build the project"
  echo "  synth     synthesize the project"
  echo "  deploy    Build and deploy the project"
  echo "  help      Show this help message"
  echo "  clear     Clear the screen"
  echo "  exit      Exit the CLI"
}
# Function to display the welcome message
display_welcome_message() {
    echo "
 _____                     ____ _     ___ 
| ____|___ ___  _ __ ___  / ___| |   |_ _|
|  _| / __/ _ \|  _   _ \| |   | |    | | 
| |__| (_| (_) | | | | | | |___| |___ | | 
|_____\___\___/|_| |_| |_|\____|_____|___|

Welcome to the EcomCLI. Type 'help' for a list of commands. Use this to aid deployment, testing, and other tasks.
"
}

# Clears the terminal and displays the welcome message
clear_and_display_welcome_message() {
    printf "\033c"
    display_welcome_message
}

# Display the welcome message
clear_and_display_welcome_message
# Main loop
while true; do
    echo -n "EcomCLI> "
    read input
    case "$input" in
        build)
            build_project
            ;;
        deploy)
            deploy_project
            ;;
        destroy)
            destroy_project
            ;;
        synth)
            synth_project
            ;;
        help)
            show_help
            ;;
        clear)
            clear_and_display_welcome_message
            ;;
        exit)
            echo "Exiting EcomCLI."
            clear
            break
            ;;
        *)
            echo "Unknown command: $input"
            echo "Type 'help' for a list of commands."
            ;;
    esac
done
