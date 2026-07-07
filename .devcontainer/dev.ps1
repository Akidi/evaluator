# Runs commands for the formula app inside the devcontainer (bypasses SentinelOne
# locking native .node binaries by keeping node_modules in Linux container volumes).
#
# Usage:
#   .devcontainer\dev.ps1 install          # pnpm install
#   .devcontainer\dev.ps1 dev              # start the SvelteKit dev server on :5173
#   .devcontainer\dev.ps1 <any command>    # run an arbitrary command in the container

param(
	[Parameter(ValueFromRemainingArguments = $true)]
	[string[]]$Args
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

$existing = podman image exists formula-dev
if ($LASTEXITCODE -ne 0) {
	podman build -t formula-dev -f "$RepoRoot\.devcontainer\Dockerfile" $RepoRoot
}

switch ($Args[0]) {
	"install" { $Cmd = "pnpm install" }
	"dev"     {
		$Cmd = "cd app && pnpm exec vite dev --host 0.0.0.0"
		# podman machine (WSL-backed) doesn't reliably forward published ports to
		# Windows localhost, so hit the VM's own IP instead.
		$VmIp = (wsl -d podman-machine-default -- sh -c "ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'").Trim()
		Write-Host "Dev server will be reachable at: http://${VmIp}:5173" -ForegroundColor Cyan
	}
	default   { $Cmd = $Args -join " " }
}

podman run --rm -it `
	-v "${RepoRoot}:/workspace" `
	-v formula-node-modules:/workspace/node_modules `
	-v formula-app-node-modules:/workspace/app/node_modules `
	-w /workspace `
	-p 5173:5173 `
	formula-dev `
	sh -c "$Cmd"
