import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

export function useYouTubeVideos(maxResults = 20) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setError('missing_key')
      setLoading(false)
      return
    }
    if (!CHANNEL_ID || CHANNEL_ID === 'YOUR_CHANNEL_ID_HERE') {
      setError('missing_channel')
      setLoading(false)
      return
    }

    async function fetchVideos() {
      try {
        // Step 1: get uploads playlist ID for the channel
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=contentDetails`
        )
        const channelData = await channelRes.json()

        if (channelData.error) throw new Error(channelData.error.message)
        if (!channelData.items?.length) throw new Error('Channel not found')

        const uploadsPlaylistId =
          channelData.items[0].contentDetails.relatedPlaylists.uploads

        // Step 2: fetch videos from uploads playlist
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=${maxResults}`
        )
        const playlistData = await playlistRes.json()

        if (playlistData.error) throw new Error(playlistData.error.message)

        const formatted = playlistData.items.map((item) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnail:
            item.snippet.thumbnails?.maxres?.url ||
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url,
          channelTitle: item.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        }))

        setVideos(formatted)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [maxResults])

  return { videos, loading, error }
}
