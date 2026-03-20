# 把 ~/.claude/ 的改动同步回 toky_wiki/setup/（install.ps1 的反向操作）
# 用法：在任意目录执行 & ~/toky_wiki/setup/sync-back.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent $scriptDir
$source = "$env:USERPROFILE\.claude"

$changed = $false

# 同步 CLAUDE.md
if (Test-Path "$source\CLAUDE.md") {
  $diff = Compare-Object (Get-Content "$source\CLAUDE.md") (Get-Content "$scriptDir\CLAUDE.md" -ErrorAction SilentlyContinue) -ErrorAction SilentlyContinue
  if ($diff) {
    Copy-Item "$source\CLAUDE.md" "$scriptDir\CLAUDE.md" -Force
    Write-Host "OK CLAUDE.md 已更新"
    $changed = $true
  }
}

# 同步 skills
if (Test-Path "$source\skills") {
  Get-ChildItem "$source\skills" -Directory | ForEach-Object {
    $skillName = $_.Name
    $skillFile = "$($_.FullName)\SKILL.md"
    if (Test-Path $skillFile) {
      $targetDir = "$scriptDir\skills\$skillName"
      New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
      $diff = Compare-Object (Get-Content $skillFile) (Get-Content "$targetDir\SKILL.md" -ErrorAction SilentlyContinue) -ErrorAction SilentlyContinue
      if ($diff) {
        Copy-Item $skillFile "$targetDir\SKILL.md" -Force
        Write-Host "OK skill: $skillName 已更新"
        $changed = $true
      }
    }
  }
}

# 同步 hooks
Get-ChildItem "$source\*.sh" -ErrorAction SilentlyContinue | ForEach-Object {
  $hookName = $_.Name
  $hooksDir = "$scriptDir\hooks"
  New-Item -ItemType Directory -Force -Path $hooksDir | Out-Null
  $diff = Compare-Object (Get-Content $_.FullName) (Get-Content "$hooksDir\$hookName" -ErrorAction SilentlyContinue) -ErrorAction SilentlyContinue
  if ($diff) {
    Copy-Item $_.FullName "$hooksDir\$hookName" -Force
    Write-Host "OK hook: $hookName 已更新"
    $changed = $true
  }
}

if (-not $changed) {
  Write-Host "没有变更，已是最新。"
  exit 0
}

# commit + push
Set-Location $repoDir
git add setup/
git commit -m "sync-back: 从本地同步配置更新"
$branch = git branch --show-current
git push -u origin $branch
Write-Host ">>> 已提交并推送到 $branch"
