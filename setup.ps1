# LeetLab Professional Setup Script
# This script automates dependency installation and environment configuration.

function Write-Header($msg) {
    Write-Host "`n=== $msg ===" -ForegroundColor Cyan
}

function Setup-Env($dir) {
    $envPath = Join-Path $dir ".env"
    $examplePath = Join-Path $dir ".env.example"
    
    if (!(Test-Path $envPath)) {
        if (Test-Path $examplePath) {
            Write-Host "Creating .env from example in $dir" -ForegroundColor Gray
            Copy-Item $examplePath $envPath
        } else {
            Write-Host "WARNING: No .env.example found in $dir" -ForegroundColor Yellow
        }
    } else {
        Write-Host ".env already exists in $dir" -ForegroundColor Gray
    }
}

Write-Header "Initializing Root Dependencies"
npm install

Write-Header "Configuring Backend"
Setup-Env "backend"
cd backend
npm install
Write-Header "Generating Prisma Client"
npx prisma generate

Write-Header "Configuring Frontend"
cd ..
Setup-Env "frontend"
cd frontend
npm install

Write-Header "Setup Complete! 🚀"
Write-Host "You can now start both frontend and backend with a single command:" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host "`nOr individually:" -ForegroundColor Gray
Write-Host "  npm run dev:backend"
Write-Host "  npm run dev:frontend"
