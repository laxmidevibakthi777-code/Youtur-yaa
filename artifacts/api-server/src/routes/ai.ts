import { Router } from 'express';
import { analyzeChannel, generateStudioContent, generateAllStudioContent, type StudioContentType } from '../lib/openrouter.js';
import { getChannelData } from '../lib/youtube.js';
import { TTLCache } from '../lib/cache.js';

const router = Router();

const analysisCache = new TTLCache<unknown>(60 * 60 * 1000); // 1 hour

const STUDIO_TYPES: StudioContentType[] = [
  'titles', 'descriptions', 'tags', 'keywords', 'hashtags',
  'scripts', 'communityPosts', 'shortIdeas', 'longVideoIdeas',
  'thumbnailText', 'pinnedComment', 'videoChapters', 'cta',
  'seoChecklist', 'titleVariations', 'descriptionVariations', 'hookIdeas',
];

// POST /api/ai/analyze
// Body: { channelId: string }
router.post('/analyze', async (req, res) => {
  const { channelId, bust } = req.body ?? {};
  if (typeof channelId !== 'string' || !/^UC[\w-]{22}$/.test(channelId)) {
    res.status(400).json({ error: 'Valid channelId is required.' });
    return;
  }

  const cacheKey = `analysis:${channelId}`;
  if (!bust) {
    const cached = analysisCache.get(cacheKey);
    if (cached) {
      res.json({ cached: true, analysis: cached });
      return;
    }
  }

  try {
    // Fetch fresh channel data for analysis
    const channelData = await getChannelData(channelId);
    if (!channelData) {
      res.status(404).json({ error: 'Channel not found.' });
      return;
    }

    // Build a concise summary for the AI (avoid sending huge payloads)
    const summary = {
      channel: {
        name: channelData.channel.name,
        handle: channelData.channel.handle,
        subscriberCount: channelData.channel.subscriberCount,
        videoCount: channelData.channel.videoCount,
        viewCount: channelData.channel.viewCount,
        country: channelData.channel.country,
        publishedAt: channelData.channel.publishedAt,
        description: channelData.channel.description.slice(0, 500),
      },
      recentVideos: channelData.videos.slice(0, 10).map(v => ({
        title: v.title,
        views: v.viewCount,
        likes: v.likeCount,
        comments: v.commentCount,
        duration: v.duration,
        publishedAt: v.publishedAt,
        tags: v.tags.slice(0, 10),
      })),
    };

    const analysis = await analyzeChannel(summary);
    analysisCache.set(cacheKey, analysis);
    res.json({ cached: false, analysis });
  } catch (err: any) {
    console.error('AI analyze error:', err);
    res.status(500).json({ error: err.message ?? 'AI analysis failed. Please try again.' });
  }
});

// POST /api/ai/studio
// Body: { type: StudioContentType, prompt: string, channelContext?: string }
router.post('/studio', async (req, res) => {
  const { type, prompt, channelContext } = req.body ?? {};

  if (!STUDIO_TYPES.includes(type)) {
    res.status(400).json({ error: `Invalid type. Must be one of: ${STUDIO_TYPES.join(', ')}` });
    return;
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  const sanitizedPrompt = prompt.trim().slice(0, 2000);
  const sanitizedContext = typeof channelContext === 'string' ? channelContext.trim().slice(0, 1000) : undefined;

  try {
    const result = await generateStudioContent(type, sanitizedPrompt, sanitizedContext);
    res.json({ type, result });
  } catch (err: any) {
    console.error('AI studio error:', err);
    res.status(500).json({ error: err.message ?? 'AI generation failed. Please try again.' });
  }
});

// POST /api/ai/studio/all
// Body: { prompt: string, channelContext?: string }
router.post('/studio/all', async (req, res) => {
  const { prompt, channelContext } = req.body ?? {};

  if (typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  const sanitizedPrompt = prompt.trim().slice(0, 2000);
  const sanitizedContext = typeof channelContext === 'string' ? channelContext.trim().slice(0, 1000) : undefined;

  try {
    const results = await generateAllStudioContent(sanitizedPrompt, sanitizedContext);
    res.json({ results });
  } catch (err: any) {
    console.error('AI studio/all error:', err);
    res.status(500).json({ error: err.message ?? 'AI generation failed. Please try again.' });
  }
});

export default router;
