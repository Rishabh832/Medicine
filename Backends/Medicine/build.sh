#!/usr/bin/env bash
set -o errexit

# ── Frontend build ──
cd /opt/render/project/src/Frontend/Medicine
npm install
npm run build

# Built files ko Django static mein copy karo
cp -r dist/* /opt/render/project/src/Backends/Medicine/static/frontend/

# ── Backend ──
cd /opt/render/project/src/Backends/Medicine
pip install -r requirements.txt
pip install gunicorn
python manage.py collectstatic --no-input
python manage.py migrate