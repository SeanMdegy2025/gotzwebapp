#!/bin/bash
# Run this from your Mac terminal to replace GitHub repo with gotzportal-only.
# Usage: from the gotzportal app directory run:
#   bash scripts/force-push-gotzportal-only.sh

set -e
GOTZPORTAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARENT="$(dirname "$GOTZPORTAL_ROOT")"
REPO_DIR="$PARENT/gotzportal-repo"
REMOTE="${1:-https://github.com/KekeEmmanuel/gotzportal.git}"

echo "Source: $GOTZPORTAL_ROOT"
echo "Target: $REPO_DIR"
rm -rf "$REPO_DIR"
mkdir -p "$REPO_DIR"

echo "Copying app (excluding node_modules, .next, .git, .env.local)..."
rsync -a \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=.env.local \
  --exclude=.vercel \
  --exclude='*.tsbuildinfo' \
  --exclude=.vercel-postgres-url.txt \
  "$GOTZPORTAL_ROOT/" \
  "$REPO_DIR/"
cp "$GOTZPORTAL_ROOT/.env.example" "$REPO_DIR/" 2>/dev/null || true
cp "$GOTZPORTAL_ROOT/.gitignore" "$REPO_DIR/" 2>/dev/null || true

echo "Initializing git and committing..."
cd "$REPO_DIR"
git init -b main
git remote add origin "$REMOTE"
git add -A
git commit -m "gotzportal app only: Next.js, admin, Neon DB, users, register, login"

echo "Force pushing to origin main (this overwrites the remote)..."
git push --force -u origin main

echo "Done. GitHub repo now contains only gotzportal."
rm -rf "$REPO_DIR"
echo "Cleaned up $REPO_DIR"
