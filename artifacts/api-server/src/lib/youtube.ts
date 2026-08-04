import { TTLCache } from './cache.js';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

function getKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not set');
  return key;
}

const channelCache = new TTLCache<ChannelData>(60 * 60 * 1000);
const searchCache = new TTLCache<ChannelSummary[]>(10 * 60 * 1000); // 10 min for search

export interface ChannelSummary {
  id: string;
  name: string;
  handle: string;
  description: string;
  thumbnail: string;
  banner: string | null;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  country: string;
  publishedAt: string;
  verified: boolean;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  tags: string[];
}

export interface ChannelData {
  channel: ChannelSummary;
  videos: VideoInfo[];
  uploadsPlaylistId: string;
}

export type InputType = 'url' | 'channelId' | 'handle' | 'name';

export function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'url';
  }
  if (/^UC[\w-]{22}$/.test(trimmed)) {
    return 'channelId';
  }
  if (trimmed.startsWith('@')) {
    return 'handle';
  }
  return 'name';
}

export function extractFromUrl(url: string): { type: 'id' | 'handle'; value: string } | null {
  try {
    const u = new URL(url.includes('://') ? url : 'https://' + url);
    // /channel/UCxxxx
    const channelMatch = u.pathname.match(/\/channel\/(UC[\w-]{22})/);
    if (channelMatch) return { type: 'id', value: channelMatch[1] };
    // /@handle or /c/name or /user/name
    const handleMatch = u.pathname.match(/\/@([\w.-]+)/);
    if (handleMatch) return { type: 'handle', value: '@' + handleMatch[1] };
    const cMatch = u.pathname.match(/\/(?:c|user)\/([\w.-]+)/);
    if (cMatch) return { type: 'handle', value: cMatch[1] };
    return null;
  } catch {
    return null;
  }
}

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<unknown> {
  const url = new URL(`${YT_BASE}/${endpoint}`);
  url.searchParams.set('key', getKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json();
}

function mapChannelItem(item: any): ChannelSummary {
  const s = item.statistics ?? {};
  const br = item.brandingSettings?.image?.bannerExternalUrl ?? null;
  return {
    id: item.id,
    name: item.snippet?.title ?? '',
    handle: item.snippet?.customUrl ? `@${item.snippet.customUrl.replace(/^@/, '')}` : '',
    description: item.snippet?.description ?? '',
    thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
    banner: br,
    subscriberCount: s.subscriberCount ?? '0',
    videoCount: s.videoCount ?? '0',
    viewCount: s.viewCount ?? '0',
    country: item.snippet?.country ?? '',
    publishedAt: item.snippet?.publishedAt ?? '',
    verified: item.status?.isLinked ?? false,
  };
}

export async function searchChannels(query: string): Promise<ChannelSummary[]> {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  const searchData: any = await ytFetch('search', {
    part: 'snippet',
    type: 'channel',
    q: query,
    maxResults: '8',
  });

  const ids: string[] = (searchData.items ?? []).map((i: any) => i.id?.channelId).filter(Boolean);
  if (ids.length === 0) return [];

  const channelData: any = await ytFetch('channels', {
    part: 'snippet,statistics,brandingSettings',
    id: ids.join(','),
    maxResults: '8',
  });

  const results: ChannelSummary[] = (channelData.items ?? []).map(mapChannelItem);
  searchCache.set(cacheKey, results);
  return results;
}

export async function getChannelById(id: string): Promise<ChannelSummary | null> {
  const data: any = await ytFetch('channels', {
    part: 'snippet,statistics,brandingSettings',
    id,
  });
  const item = data.items?.[0];
  if (!item) return null;
  return mapChannelItem(item);
}

export async function getChannelByHandle(handle: string): Promise<ChannelSummary | null> {
  const cleanHandle = handle.replace(/^@/, '');
  // Try forHandle first (newer API feature)
  try {
    const data: any = await ytFetch('channels', {
      part: 'snippet,statistics,brandingSettings',
      forHandle: `@${cleanHandle}`,
    });
    const item = data.items?.[0];
    if (item) return mapChannelItem(item);
  } catch {
    // fall through
  }
  // Fallback: search
  const results = await searchChannels(`@${cleanHandle}`);
  return results[0] ?? null;
}

async function getVideoDetails(videoIds: string[]): Promise<VideoInfo[]> {
  if (videoIds.length === 0) return [];
  const data: any = await ytFetch('videos', {
    part: 'snippet,statistics,contentDetails',
    id: videoIds.join(','),
    maxResults: String(videoIds.length),
  });
  return (data.items ?? []).map((v: any): VideoInfo => ({
    id: v.id,
    title: v.snippet?.title ?? '',
    description: v.snippet?.description ?? '',
    thumbnail: v.snippet?.thumbnails?.high?.url ?? v.snippet?.thumbnails?.medium?.url ?? '',
    publishedAt: v.snippet?.publishedAt ?? '',
    viewCount: v.statistics?.viewCount ?? '0',
    likeCount: v.statistics?.likeCount ?? '0',
    commentCount: v.statistics?.commentCount ?? '0',
    duration: v.contentDetails?.duration ?? '',
    tags: v.snippet?.tags ?? [],
  }));
}

export async function getChannelData(channelId: string, bust = false): Promise<ChannelData | null> {
  const cacheKey = `channel:${channelId}`;
  if (!bust) {
    const cached = channelCache.get(cacheKey);
    if (cached) return cached;
  }

  // Get channel info + uploads playlist
  const chData: any = await ytFetch('channels', {
    part: 'snippet,statistics,contentDetails,brandingSettings',
    id: channelId,
  });
  const chItem = chData.items?.[0];
  if (!chItem) return null;

  const uploadsPlaylistId: string = chItem.contentDetails?.relatedPlaylists?.uploads ?? '';
  const channel = mapChannelItem(chItem);

  let videos: VideoInfo[] = [];
  if (uploadsPlaylistId) {
    const playlistData: any = await ytFetch('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: '20',
    });
    const videoIds: string[] = (playlistData.items ?? [])
      .map((item: any) => item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId)
      .filter(Boolean);
    videos = await getVideoDetails(videoIds);
  }

  const result: ChannelData = { channel, videos, uploadsPlaylistId };
  channelCache.set(cacheKey, result);
  return result;
}

export function invalidateChannel(channelId: string): void {
  channelCache.delete(`channel:${channelId}`);
}
