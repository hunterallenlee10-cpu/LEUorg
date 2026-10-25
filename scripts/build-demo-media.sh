#!/usr/bin/env bash
# Builds the demos' video clips and their stills from the Higgsfield
# downloads (docs/DEMO-MEDIA-PLAN.md):
#
#   scripts/build-demo-media.sh <folder>
#
# <folder> holds the raw clips by the names below (v-reel-belt.mp4 and so on).
# Anything missing is skipped. Every clip comes out muted H.264 with
# +faststart, small enough to load with the page section it sits in, and with
# a WebP still of its first frame beside it (the poster DemoVideo shows until
# the clip plays, and instead of it under reduced motion).
#
# Needs ffmpeg with libx264 and libwebp.
set -euo pipefail

src="${1:?usage: scripts/build-demo-media.sh <folder of raw clips>}"
root="$(cd "$(dirname "$0")/.." && pwd)"
ff() { ffmpeg -hide_banner -v error -y "$@"; }
have() { [ -f "$src/$1" ]; }

X264=(-c:v libx264 -preset slow -pix_fmt yuv420p -movflags +faststart -an)

# A still of a clip's first frame, as WebP.
poster() { ff -i "$1" -frames:v 1 -c:v libwebp -quality 78 "$2"; }

# A seamless loop, scaled and cropped to WxH: the clip as made, minus the
# last frame (the same as the first, so the loop doesn't stutter on it).
loop() { # in out W H crf
  local frames
  frames=$(ffprobe -v error -select_streams v -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$1")
  ff -i "$1" -vf "scale=$3:$4:force_original_aspect_ratio=increase,crop=$3:$4,trim=end_frame=$((frames - 1)),setpts=PTS-STARTPTS" \
    "${X264[@]}" -crf "$5" "$2"
}

# --- Content & Social Media: the edited clip (9:16) ------------------------
content="$root/public/demos/content"
mkdir -p "$content"
if have v-reel-ladder.mp4 && have v-reel-gutter.mp4 && have v-reel-house.mp4; then
  # Edited: three two-second shots, cut on the captions' beat (services.css
  # `svc-a-word*`, a six-second loop), graded warmer and punchier, each
  # pushing in a little. The captions and hook stay in code over it.
  shot='scale=w=540*(1+0.07*t/2):h=-2:eval=frame,crop=540:960,eq=contrast=1.08:saturation=1.18:brightness=0.01,vignette=PI/5,setsar=1,fps=24'
  ff -ss 0.4 -t 2 -i "$src/v-reel-ladder.mp4" -ss 0.6 -t 2 -i "$src/v-reel-gutter.mp4" -ss 1.0 -t 2 -i "$src/v-reel-house.mp4" \
    -filter_complex "[0]setpts=PTS-STARTPTS,$shot[a];[1]setpts=PTS-STARTPTS,$shot[b];[2]setpts=PTS-STARTPTS,$shot[c];[a][b][c]concat=n=3:v=1:a=0" \
    "${X264[@]}" -crf 27 "$content/edited.mp4"
  poster "$content/edited.mp4" "$content/poster.webp"
fi

# --- Marketing & Lead Generation: the sponsored ad as video ----------------
video="$root/public/demos/video"
mkdir -p "$video"
if have v-ad.mp4; then
  loop "$src/v-ad.mp4" "$video/ad.mp4" 960 540 29
  poster "$video/ad.mp4" "$root/public/demos/img/ad-house.webp"
fi

# --- Loops of the industry pictures and the store's satchel (16:9) --------
# Each serves the Websites demo's hero for its industry and, where there is
# one, the Who we help card on How It Works.
for name in law-firms home-services real-estate fitness dealerships restaurants online-stores satchel; do
  if have "v-loop-$name.mp4"; then
    loop "$src/v-loop-$name.mp4" "$video/$name.mp4" 800 450 29
    poster "$video/$name.mp4" "$video/$name.webp"
  fi
done

# --- The service tiles' live posters (16:9, cropped to the tile in CSS) -----
for name in websites get-found ai-calls follow-up content custom-ai; do
  if have "v-tile-$name.mp4"; then
    loop "$src/v-tile-$name.mp4" "$video/tile-$name.mp4" 800 450 29
    poster "$video/tile-$name.mp4" "$video/tile-$name.webp"
  fi
done

# --- The desk behind the onboarding devices on How It Works ----------------
if have v-onboarding-desk.mp4; then
  loop "$src/v-onboarding-desk.mp4" "$video/onboarding-desk.mp4" 960 540 30
  poster "$video/onboarding-desk.mp4" "$video/onboarding-desk.webp"
fi

# --- The satchel's turntable: 36 frames for the drag-to-spin -------------
if have v-spin-satchel.mp4; then
  mkdir -p "$root/public/demos/img/spin"
  ff -i "$src/v-spin-satchel.mp4" -vf "fps=36/5,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,tile=6x6" \
    -frames:v 1 -c:v libwebp -quality 74 "$root/public/demos/img/spin/satchel.webp"
fi

echo "built"
