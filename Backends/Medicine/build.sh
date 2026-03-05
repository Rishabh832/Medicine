#!/usr/bin/env bash
set -o errexit

# ── Frontend build ──
cd /opt/render/project/src/Frontend/Medicine
npm install
npm run build


# ── Backend ──
cd /opt/render/project/src/Backends/Medicine
pip install -r requirements.txt
pip install gunicorn
python manage.py collectstatic --no-input
python manage.py migrate