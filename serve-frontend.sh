#!/bin/bash
echo "Starting local server for ImageInsights frontend..."
echo "Open http://localhost:8080 in your browser"
cd frontend && python3 -m http.server 8080
