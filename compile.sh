#!/bin/bash

# Start TypeScript compiler in watch mode
tsc --watch -p ts/ &

# Start Sass compiler in watch mode
sass --watch scss:css &

# Keep the script running
wait

