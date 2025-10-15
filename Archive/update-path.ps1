$winApps = "$env:LOCALAPPDATA\Microsoft\WindowsApps"
if (-not (($env:Path -split ';') -contains $winApps)) {
  [Environment]::SetEnvironmentVariable('Path', $env:Path + ';' + $winApps, 'User')
  "PATH updated. Close this window and open a NEW PowerShell, then run: winget --info"
} else {
  "WindowsApps already on PATH. Close this window and open a NEW PowerShell, then run: winget --info"
}
