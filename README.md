<div align="center">

<img src="Logo.png" alt="Muvora" width="140" />

# Muvora

**A clean, modern music player for Android.**

Stream from YouTube Music, play your local files, and enjoy a fast,
Apple-Music-inspired interface with dynamic theming and synced lyrics.

[Download](#download) · [Features](#features) · [Build](#building-from-source) · [Credits](#credits) · [Legal](#disclaimer--legal)

</div>

---

> [!IMPORTANT]
> Muvora is a personal project. It is **not affiliated with, endorsed by, or
> connected to** YouTube, Google, Spotify, or any other service it talks to.
> It does not host any music. Use it at your own discretion.

## Download

Grab the latest APK from the **[Releases](../../releases/latest)** page, or from
the project website.

Most phones want `app-prod-arm64-v8a-debug.apk`. If that one refuses to install,
use `app-prod-universal-debug.apk` (larger, runs anywhere).

Sideloading needs "Install unknown apps" enabled for whatever app opens the
download (your browser or Files app). Android will prompt you the first time.

## Features

- **Streaming** — search, browse, and play anything on YouTube Music.
- **Local library** — play music already on your device.
- **Offline downloads** — save tracks with embedded metadata.
- **Gapless & crossfade** — smooth transitions, adjustable crossfade.
- **Synced lyrics** — word-level highlighting from multiple providers.
- **Dynamic theming** — colors pulled from the album artwork.
- **Frosted-glass UI** — translucent, Material 3 interface.
- **Spotify import** — bring in your playlists and Liked Songs.
- **Background playback** — proper media session and notification controls.
- **Sleep timer, speed control, equalizer**, and more.

## Signing in

Sign-in happens inside the app against Google's own login page, so 2FA and
passkeys work normally.

1. Open Muvora and tap **Sign in** (or **Skip sign in** to browse without an
   account).
2. Complete Google login in the in-app page.
3. If your account has more than one channel, pick the one you want and confirm.

Your session is stored encrypted on the device. The app never sees your
password.

## Building from source

Requirements:

- JDK 21 (Android Studio's bundled JBR works well)
- Android SDK with platform 37 and NDK
- The Android SDK path in `local.properties` (`sdk.dir=...`)

```bash
# Debug APK (what most people want for testing)
./gradlew :app:assembleProdDebug

# Build straight onto a connected phone
./gradlew :app:installProdDebug
```

Output lands in `app/build/outputs/apk/prod/debug/`.

Two product flavors exist, `dev` and `prod`, so a development build
(`com.ritur.muvora.dev`) can sit installed next to the main one
(`com.ritur.muvora`).

## Credits

Muvora is a fork of **[BitChord](https://github.com/kushagrasinghx/BitChord)**
by [kushagrasinghx](https://github.com/kushagrasinghx), used under the GPLv3.
Enormous thanks to the BitChord authors and to the lyrics and metadata providers
their work builds on. All original credits are preserved in
[`ADDITIONAL.md`](ADDITIONAL.md).

## Disclaimer & Legal

Muvora is an independent, non-commercial, third-party music player.

- **No media hosting.** Muvora does not host, upload, or store any copyrighted
  music. It only scans local storage or streams from public and
  user-authenticated APIs.
- **Your responsibility.** This software is for personal, educational, and
  fair-use purposes. You are responsible for complying with your local copyright
  laws and with the terms of service of any platform you connect it to.
- **Trademarks.** YouTube, YouTube Music, Google, and Spotify are trademarks of
  their respective owners. Muvora is not associated with any of them.

See [`DMCA.md`](DMCA.md) for takedown and copyright-contact information.

## License

Muvora is free software under the **GNU General Public License v3.0 (GPLv3)**,
the same license as the upstream project. See [`LICENSE`](LICENSE). Any
redistribution must include the corresponding source under the same license.
