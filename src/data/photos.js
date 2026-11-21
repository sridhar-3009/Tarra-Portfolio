// ─── Camera Roll ──────────────────────────────────────────────────────────────
// Every image in src/assets/photos/ is picked up automatically. Add a caption
// here (keyed by file name) if you want one shown in the closer look.

const captions = {
  // '2026-11-21-arthurs-seat.jpg': 'Arthur’s Seat at sunrise',
}

const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

export const photos = Object.entries(files)
  .map(([path, src]) => {
    const name = path.split('/').pop()
    return { name, src, caption: captions[name] || '' }
  })
  .sort((a, b) => b.name.localeCompare(a.name))
