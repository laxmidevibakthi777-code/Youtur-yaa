import { Router } from 'express';
import {
  detectInputType,
  extractFromUrl,
  searchChannels,
  getChannelById,
  getChannelByHandle,
  getChannelData,
  invalidateChannel,
} from '../lib/youtube.js';

const router = Router();

// Sanitize input
function sanitize(input: string): string {
  return input.trim().slice(0, 200).replace(/<[^>]*>/g, '');
}

// GET /api/youtube/search?q=...
router.get('/search', async (req, res) => {
  const raw = req.query.q;
  if (typeof raw !== 'string' || !raw.trim()) {
    res.status(400).json({ error: 'Query parameter q is required.' });
    return;
  }

  const q = sanitize(raw);

  try {
    const inputType = detectInputType(q);

    if (inputType === 'url') {
      const extracted = extractFromUrl(q);
      if (!extracted) {
        res.status(400).json({ error: 'Could not extract channel from URL.' });
        return;
      }
      let channel;
      if (extracted.type === 'id') {
        channel = await getChannelById(extracted.value);
      } else {
        channel = await getChannelByHandle(extracted.value);
      }
      if (!channel) {
        res.status(404).json({ error: 'Channel not found.' });
        return;
      }
      res.json({ type: 'direct', channel });
      return;
    }

    if (inputType === 'channelId') {
      const channel = await getChannelById(q);
      if (!channel) {
        res.status(404).json({ error: 'Channel not found.' });
        return;
      }
      res.json({ type: 'direct', channel });
      return;
    }

    if (inputType === 'handle') {
      const channel = await getChannelByHandle(q);
      if (!channel) {
        res.status(404).json({ error: 'Channel not found.' });
        return;
      }
      res.json({ type: 'direct', channel });
      return;
    }

    // name search
    const channels = await searchChannels(q);
    res.json({ type: 'search', channels });
  } catch (err: any) {
    console.error('YouTube search error:', err);
    res.status(500).json({ error: err.message ?? 'YouTube API error. Please try again.' });
  }
});

// GET /api/youtube/channel/:id
router.get('/channel/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !/^UC[\w-]{22}$/.test(id)) {
    res.status(400).json({ error: 'Invalid channel ID format.' });
    return;
  }

  try {
    const bust = req.query.refresh === 'true';
    const data = await getChannelData(id, bust);
    if (!data) {
      res.status(404).json({ error: 'Channel not found.' });
      return;
    }
    res.json(data);
  } catch (err: any) {
    console.error('YouTube channel error:', err);
    res.status(500).json({ error: err.message ?? 'YouTube API error. Please try again.' });
  }
});

// DELETE /api/youtube/channel/:id/cache
router.delete('/channel/:id/cache', (req, res) => {
  const { id } = req.params;
  invalidateChannel(id);
  res.json({ ok: true });
});

export default router;
