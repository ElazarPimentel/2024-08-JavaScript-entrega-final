#!/bin/bash

# Create a temporary file
temp_file=$(mktemp /tmp/temp.XXXXXX)

# Insert index.html with separator lines
echo -e "\n------------\n" >> "$temp_file"
cat "index.html" >> "$temp_file"
echo -e "\n------------\n" >> "$temp_file"

# Insert scss/style.scss with separator lines
echo -e "\n------------\n" >> "$temp_file"
cat "scss/style.scss" >> "$temp_file"
echo -e "\n------------\n" >> "$temp_file"

# Concatenate all .js files into the temporary file with separator lines
for file in js/*.js; do
  echo -e "\n------------\n" >> "$temp_file"
  cat "$file" >> "$temp_file"
  echo -e "\n------------\n" >> "$temp_file"
done

# Open the temporary file in gedit
gedit "$temp_file"

# Wait for gedit to close
wait $!

# Remove the temporary file
rm -f "$temp_file"

