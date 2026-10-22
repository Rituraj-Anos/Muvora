<#
.SYNOPSIS
  Cut a Muvora release: bump the version, build signed APKs, publish them to
  GitHub Releases (which the website's download buttons point at), and push
  the build to Firebase App Distribution so testers' phones get notified.

.EXAMPLE
  .\scripts\release.ps1 -Version 1.9.0 -Notes "New icon, faster search"

.NOTES
  Needs, once:
    - keystore.properties + muvora-release.jks in the repo root (gitignored)
    - git already signed in to GitHub (Git Credential Manager), the same
      login used for `git push`; its token is read only to call the GitHub
      API for this repository and is never written to disk except a temp
      header file that is deleted right after the upload
    - for Firebase: `firebase login` and "firebaseAppId" set in
      scripts/release-config.json
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][ValidatePattern('^\d+\.\d+\.\d+$')][string]$Version,
  [string]$Notes = "",
  [switch]$SkipGitHub,
  [switch]$SkipFirebase,
  [switch]$AllowDirty
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$Repo = 'Rituraj-Anos/Muvora'
$Tag = "v$Version"
if (-not $Notes) { $Notes = "Muvora $Version" }
$Config = Get-Content (Join-Path $PSScriptRoot 'release-config.json') -Raw | ConvertFrom-Json
$Gradle = Join-Path $Root 'build.gradle.kts'
$OutDir = Join-Path $Root 'dist\release'
$ApkDir = Join-Path $Root 'app\build\outputs\apk\prod\release'
# Stable names: /releases/latest/download/<name> always serves the newest one.
$Assets = [ordered]@{
  'app-prod-arm64-v8a-release.apk'   = 'Muvora-arm64-v8a.apk'
  'app-prod-universal-release.apk'   = 'Muvora-universal.apk'
  'app-prod-armeabi-v7a-release.apk' = 'Muvora-armeabi-v7a.apk'
}

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------- preflight
Step "Preflight"
if (-not (Test-Path 'keystore.properties') -or -not (Test-Path 'muvora-release.jks')) {
  Fail "keystore.properties / muvora-release.jks missing. Release builds must be signed with the Muvora key."
}
if (-not $AllowDirty -and (git status --porcelain)) {
  Fail "Working tree has uncommitted changes. Commit them first, or pass -AllowDirty."
}
if (git tag --list $Tag) { Fail "Tag $Tag already exists." }
$useFirebase = -not $SkipFirebase -and $Config.firebaseAppId
if (-not $SkipFirebase -and -not $Config.firebaseAppId) {
  Write-Host "firebaseAppId is empty in scripts/release-config.json, so Firebase upload is skipped." -ForegroundColor Yellow
}
if ($useFirebase -and -not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Fail "Firebase CLI not found. Install it with: npm install -g firebase-tools"
}
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'

# ----------------------------------------------------------- version bump
Step "Bumping version to $Version"
$src = [IO.File]::ReadAllText($Gradle)
$code = [int]([regex]::Match($src, 'extra\["bitchordVersionCode"\] = (\d+)').Groups[1].Value)
if (-not $code) { Fail "Could not find bitchordVersionCode in build.gradle.kts" }
$newCode = $code + 1
$bumped = $src `
  -replace 'extra\["bitchordVersionCode"\] = \d+', "extra[`"bitchordVersionCode`"] = $newCode" `
  -replace 'extra\["bitchordVersionName"\] = "[^"]*"', "extra[`"bitchordVersionName`"] = `"$Version`"" `
  -replace 'extra\["bitchordBetaSuffix"\] = "[^"]*"', 'extra["bitchordBetaSuffix"] = ""'
[IO.File]::WriteAllText($Gradle, $bumped)
Write-Host "versionCode $code -> $newCode, versionName $Version"

# ------------------------------------------------------------------ build
Step "Building signed release APKs (takes a few minutes)"
& .\gradlew.bat :app:assembleProdRelease --console=plain
if ($LASTEXITCODE -ne 0) {
  [IO.File]::WriteAllText($Gradle, $src)
  Fail "Gradle build failed; version bump reverted."
}

New-Item -ItemType Directory -Force $OutDir | Out-Null
Get-ChildItem $OutDir -Filter *.apk | Remove-Item
foreach ($from in $Assets.Keys) {
  $path = Join-Path $ApkDir $from
  if (-not (Test-Path $path)) { Fail "Expected build output missing: $from" }
  Copy-Item $path (Join-Path $OutDir $Assets[$from])
}
Get-ChildItem $OutDir -Filter *.apk | ForEach-Object { "{0,-26} {1,6:N1} MB" -f $_.Name, ($_.Length / 1MB) }

# -------------------------------------------------------- commit and tag
Step "Committing and tagging $Tag"
git add build.gradle.kts
git commit -m "Release $Tag" | Out-Null
git tag -a $Tag -m "Muvora $Version"
git push origin HEAD
git push origin $Tag
if ($LASTEXITCODE -ne 0) { Fail "git push failed." }

# --------------------------------------------------------- GitHub release
if (-not $SkipGitHub) {
  Step "Publishing GitHub release $Tag"
  $cred = "protocol=https`nhost=github.com`n`n" | git credential fill
  $token = ($cred | Where-Object { $_ -like 'password=*' }) -replace '^password=', ''
  if (-not $token) { Fail "No GitHub credential found. Run any 'git push' once to sign in, then retry with -SkipFirebase if needed." }

  $headers = @{ Authorization = "Bearer $token"; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28' }
  $body = @{ tag_name = $Tag; name = "Muvora $Version"; body = $Notes; make_latest = 'true' } | ConvertTo-Json
  $release = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$Repo/releases" -Headers $headers -Body $body -ContentType 'application/json'
  $uploadBase = $release.upload_url -replace '\{.*\}$', ''

  $hdrFile = New-TemporaryFile
  try {
    Set-Content $hdrFile "Authorization: Bearer $token" -Encoding ascii
    foreach ($name in $Assets.Values) {
      Write-Host "uploading $name"
      $file = Join-Path $OutDir $name
      $resp = curl.exe -sS --fail-with-body -H "@$hdrFile" -H 'Content-Type: application/vnd.android.package-archive' `
        --data-binary "@$file" "$uploadBase`?name=$name"
      if ($LASTEXITCODE -ne 0) { Fail "Upload of $name failed: $resp" }
    }
  } finally {
    Remove-Item $hdrFile -Force -ErrorAction SilentlyContinue
  }
  Write-Host "Release: $($release.html_url)"
}

# ------------------------------------------------------------- Firebase
if ($useFirebase) {
  Step "Sending build to Firebase App Distribution"
  firebase appdistribution:distribute (Join-Path $OutDir $Config.firebaseApk) `
    --app $Config.firebaseAppId `
    --groups $Config.firebaseTesterGroups `
    --release-notes $Notes
  if ($LASTEXITCODE -ne 0) { Fail "Firebase upload failed (the GitHub release is already live)." }
}

Step "Done. Muvora $Version is out."
