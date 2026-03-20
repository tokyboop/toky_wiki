# 把 setup/ 下的配置同步到 ~/.claude/（Windows PowerShell 版）
# 用法：在 toky_wiki 根目录执行 .\setup\install.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = "$env:USERPROFILE\.claude"

Write-Host ">>> 安装 CLAUDE.md..."
Copy-Item "$scriptDir\CLAUDE.md" "$target\CLAUDE.md" -Force

Write-Host ">>> 安装 skills..."
Get-ChildItem "$scriptDir\skills" -Directory | ForEach-Object {
  $skillName = $_.Name
  New-Item -ItemType Directory -Force -Path "$target\skills\$skillName" | Out-Null
  Copy-Item "$($_.FullName)\SKILL.md" "$target\skills\$skillName\SKILL.md" -Force
  Write-Host "    OK $skillName"
}

Write-Host ">>> 安装 hooks..."
$hooksDir = "$scriptDir\hooks"
if (Test-Path $hooksDir) {
  Get-ChildItem "$hooksDir\*.sh" | ForEach-Object {
    Copy-Item $_.FullName "$target\$($_.Name)" -Force
    Write-Host "    OK $($_.Name)"
  }
}

Write-Host ">>> 完成。已同步到 $target"
