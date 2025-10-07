# start-all.ps1 - helpful script to start dev services on Windows PowerShell
# Usage: Right-click -> Run with PowerShell or run from elevated prompt if needed
# This script will attempt to start mongod (if installed in PATH), Node backend, and Next frontend
# Each service will open in a new PowerShell window using Start-Process

param(
  [string]$MongoCmd = 'mongod',
  [string]$NodeDir = 'e:/VitaTrackr/backend/node',
  [string]$FrontendDir = 'e:/VitaTrackr/frontend'
)

function Start-Terminal {
  param([string]$pwshArgs, [string]$title)
  # Prefer Windows Terminal if available
  if (Get-Command wt.exe -ErrorAction SilentlyContinue) {
    $cmd = "wt -w 0 new-tab powershell -NoExit -Command \"$pwshArgs\" -t \"$title\""
    Start-Process -FilePath wt.exe -ArgumentList "new-tab","powershell -NoExit -Command $pwshArgs" -NoNewWindow -WindowStyle Normal
  } else {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'powershell.exe'
    $psi.Arguments = "-NoExit -Command \"$pwshArgs\""
    $psi.WorkingDirectory = [System.IO.Path]::GetDirectoryName($pwshArgs)
    Start-Process -FilePath $psi.FileName -ArgumentList $psi.Arguments -WindowStyle Normal
  }
}

Write-Host "Starting dev services..."

# Basic port check helper
function Test-PortInUse($port){
  try{
    $listener = [System.Net.Sockets.TcpClient]::new('127.0.0.1', $port)
    $listener.Close()
    return $true
  } catch { return $false }
}

if (Test-PortInUse 5001) { Write-Host "Warning: port 5001 appears in use. Backend may not start." }
if (Test-PortInUse 3000) { Write-Host "Warning: port 3000 appears in use. Frontend may not start." }

# 1) Try to start MongoDB (if available)
if (Get-Command $MongoCmd -ErrorAction SilentlyContinue) {
  Write-Host "Found $MongoCmd, starting mongod in new window..."
  Start-Terminal "cd $NodeDir; $MongoCmd" "MongoDB"
} else {
  Write-Host "mongod not found in PATH. If you use a local Mongo installation, start it manually."
}

# 2) Start Node backend (npm run dev)
if (Test-Path "$NodeDir\package.json") {
  Write-Host "Starting Node backend (npm run dev) in new window..."
  Start-Terminal "cd $NodeDir; npm run dev" "Node Backend"
} else {
  Write-Host "Backend package.json not found at $NodeDir"
}

# 3) Start Next frontend (npm run dev)
if (Test-Path "$FrontendDir\package.json") {
  Write-Host "Starting Next frontend (npm run dev) in new window..."
  Start-Terminal "cd $FrontendDir; npm run dev" "Next Frontend"
} else {
  Write-Host "Frontend package.json not found at $FrontendDir"
}

Write-Host "All start commands issued. Check the new windows for logs."
