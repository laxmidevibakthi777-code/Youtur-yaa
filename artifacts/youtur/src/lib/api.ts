// All API calls go to /api which is routed by Replit to the api-server on port 8080.
// Keys never leave the server.

const BASE = '/api';

async function request<T>(
  path: string,
  options?: RequestInit,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...options, signal });
  let body: any;
  try {
    body = await res.json();
  } catch {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  if (!res.ok) {
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return body as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

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

export type SearchResponse =
  | { type: 'direct'; channel: ChannelSummary }
  | { type: 'search'; channels: ChannelSummary[] };

export interface ChannelAnalysis {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  growthOpportunities: string[];
  seoScore: number;
  brandScore: number;
  ctrSuggestions: string[];
  contentStrategy: string;
  postingSchedule: string;
  audienceAnalysis: string;
  competitorSuggestions: string[];
  growthRoadmap: string;
  plan30Day: string[];
  plan90Day: string[];
}

export interface AnalysisResponse {
  cached: boolean;
  analysis: ChannelAnalysis;
}

export type StudioContentType =
  | 'titles' | 'descriptions' | 'tags' | 'keywords' | 'hashtags'
  | 'scripts' | 'communityPosts' | 'shortIdeas' | 'longVideoIdeas'
  | 'thumbnailText' | 'pinnedComment' | 'videoChapters' | 'cta'
  | 'seoChecklist' | 'titleVariations' | 'descriptionVariations' | 'hookIdeas';

export interface StudioResponse {
  type: StudioContentType;
  result: Record<string, unknown>;
}

export interface StudioAllResponse {
  results: Record<StudioContentType, Record<string, unknown>>;
}

// ── API Client ────────────────────────────────────────────────────────────────

export const api = {
  youtube: {
    search: (q: string, signal?: AbortSignal) =>
      request<SearchResponse>(`/youtube/search?q=${encodeURIComponent(q)}`, {}, signal),

    channel: (id: string, refresh = false) =>
      request<ChannelData>(`/youtube/channel/${id}${refresh ? '?refresh=true' : ''}`),
  },

  ai: {
    analyze: (channelId: string, bust = false) =>
      request<AnalysisResponse>('/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, bust }),
      }),

    studio: (type: StudioContentType, prompt: string, channelContext?: string, signal?: AbortSignal) =>
      request<StudioResponse>('/ai/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt, channelContext }),
      }, signal),

    studioAll: (prompt: string, channelContext?: string, signal?: AbortSignal) =>
      request<StudioAllResponse>('/ai/studio/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, channelContext }),
      }, signal),
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

export function fmtNumber(n: string | number): string {
  const num = typeof n === 'string' ? parseInt(n, 10) : n;
  if (isNaN(num)) return '0';
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = parseInt(match[1] ?? '0');
  const m = parseInt(match[2] ?? '0');
  const s = parseInt(match[3] ?? '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// LocalStorage: tracked channels (for My Channels page)
const LS_CHANNELS = 'youtur_tracked_channels';

export function getTrackedChannels(): ChannelSummary[] {
  try {
    return JSON.parse(localStorage.getItem(LS_CHANNELS) ?? '[]');
  } catch {
    return [];
  }
}

export function addTrackedChannel(ch: ChannelSummary): void {
  const channels = getTrackedChannels().filter(c => c.id !== ch.id);
  channels.unshift(ch);
  localStorage.setItem(LS_CHANNELS, JSON.stringify(channels.slice(0, 20)));
}

export function removeTrackedChannel(id: string): void {
  const channels = getTrackedChannels().filter(c => c.id !== id);
  localStorage.setItem(LS_CHANNELS, JSON.stringify(channels));
}
