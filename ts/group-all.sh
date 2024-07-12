#!/bin/bash

# Create a temporary file
temp_file=$(mktemp /tmp/temp.XXXXXX)

# Concatenate all *.ts files into the temporary file with separator lines
for file in *.ts; {
  cat "$file" >> "$temp_file"
  echo -e "\n-------------------\n" >> "$temp_file"
}

# Open the temporary file in gedit
gedit "$temp_file"

# Wait for gedit to close
wait $!

# Remove the temporary file
rm -f "$temp_file"

