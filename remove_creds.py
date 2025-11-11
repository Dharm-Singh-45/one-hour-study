#!/usr/bin/env python3
import re
import os
import sys

file_path = 'lib/db.ts'
if os.path.exists(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove the hardcoded connection string - match the exact pattern
    pattern = r"process\.env\.MONGODB_URI\s*\|\|\s*'mongodb\+srv://[^']+'"
    replacement = "process.env.MONGODB_URI"
    new_content = re.sub(pattern, replacement, content)
    
    with open(file_path, 'w') as f:
        f.write(new_content)

