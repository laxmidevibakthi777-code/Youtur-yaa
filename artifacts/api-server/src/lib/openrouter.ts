const OR_BASE = 'https://openrouter.ai/api/v1';
const MODEL = 'openai/gpt-4o-mini';

function getKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not set');
  return key;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function chatCompletion(messages: Message[], attempt = 1): Promise<string> {
  const res = await fetch(`${OR_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://youtur.app',
      'X-Title': 'YOUTUR AI Creator Hub',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 1500));
      return chatCompletion(messages, attempt + 1);
    }
    throw new Error(`OpenRouter API error ${res.status}: ${body}`);
  }

  const data: any = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function parseJson<T>(raw: string, fallback: T): T {
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : raw;
  try {
    return JSON.parse(jsonStr.trim()) as T;
  } catch {
    return fallback;
  }
}

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

export async function analyzeChannel(channelData: unknown): Promise<ChannelAnalysis> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an elite YouTube growth strategist and data analyst. You analyze YouTube channel data and produce actionable, specific insights. Always respond with valid JSON only — no markdown fences, no extra text.`,
    },
    {
      role: 'user',
      content: `Analyze this YouTube channel data and return a JSON object with these exact keys:
{
  "executiveSummary": "2-3 sentence overview of the channel's current position and potential",
  "strengths": ["array of 4-6 specific strengths"],
  "weaknesses": ["array of 4-6 specific weaknesses"],
  "growthOpportunities": ["array of 5-7 specific actionable opportunities"],
  "seoScore": <number 0-100>,
  "brandScore": <number 0-100>,
  "ctrSuggestions": ["array of 5 specific CTR improvement tactics"],
  "contentStrategy": "detailed paragraph on content strategy",
  "postingSchedule": "specific recommended posting schedule with reasoning",
  "audienceAnalysis": "detailed paragraph on audience demographics and behavior",
  "competitorSuggestions": ["array of 3-5 competitor channel names to study"],
  "growthRoadmap": "paragraph describing the path to doubling subscribers",
  "plan30Day": ["array of 5-7 specific 30-day action items"],
  "plan90Day": ["array of 5-7 specific 90-day milestones"]
}

Channel Data:
${JSON.stringify(channelData, null, 2)}`,
    },
  ];

  const raw = await chatCompletion(messages);
  return parseJson<ChannelAnalysis>(raw, {
    executiveSummary: 'Analysis unavailable.',
    strengths: [],
    weaknesses: [],
    growthOpportunities: [],
    seoScore: 0,
    brandScore: 0,
    ctrSuggestions: [],
    contentStrategy: '',
    postingSchedule: '',
    audienceAnalysis: '',
    competitorSuggestions: [],
    growthRoadmap: '',
    plan30Day: [],
    plan90Day: [],
  });
}

export type StudioContentType =
  | 'titles' | 'descriptions' | 'tags' | 'keywords' | 'hashtags'
  | 'scripts' | 'communityPosts' | 'shortIdeas' | 'longVideoIdeas'
  | 'thumbnailText' | 'pinnedComment' | 'videoChapters' | 'cta'
  | 'seoChecklist' | 'titleVariations' | 'descriptionVariations' | 'hookIdeas';

const studioPrompts: Record<StudioContentType, string> = {
  titles: 'Generate 5 high-CTR YouTube video titles. Return JSON: {"titles": ["..."]}',
  descriptions: 'Generate a compelling YouTube video description with chapters, keywords, and CTAs. Return JSON: {"description": "..."}',
  tags: 'Generate 15 SEO-optimized YouTube tags. Return JSON: {"tags": ["..."]}',
  keywords: 'Generate 10 primary and 10 secondary keywords for YouTube SEO. Return JSON: {"primary": ["..."], "secondary": ["..."]}',
  hashtags: 'Generate 10 trending YouTube hashtags. Return JSON: {"hashtags": ["..."]}',
  scripts: 'Generate a short engaging video script with hook, main points, and CTA. Return JSON: {"script": "..."}',
  communityPosts: 'Generate 3 engaging YouTube community post ideas. Return JSON: {"posts": ["..."]}',
  shortIdeas: 'Generate 5 YouTube Shorts ideas with hooks. Return JSON: {"ideas": ["..."]}',
  longVideoIdeas: 'Generate 5 long-form YouTube video ideas with angles. Return JSON: {"ideas": ["..."]}',
  thumbnailText: 'Generate 5 punchy thumbnail text options (max 5 words each). Return JSON: {"options": ["..."]}',
  pinnedComment: 'Generate 3 pinned comment options that drive engagement. Return JSON: {"comments": ["..."]}',
  videoChapters: 'Generate timestamped video chapters for a 15-minute video. Return JSON: {"chapters": ["0:00 Intro", "..."]}',
  cta: 'Generate 5 compelling call-to-action scripts for the end of the video. Return JSON: {"ctas": ["..."]}',
  seoChecklist: 'Generate a 10-point YouTube SEO checklist. Return JSON: {"checklist": ["..."]}',
  titleVariations: 'Generate 8 title variations with different emotional angles. Return JSON: {"variations": ["..."]}',
  descriptionVariations: 'Generate 3 description variations (casual, professional, viral). Return JSON: {"variations": ["..."]}',
  hookIdeas: 'Generate 5 powerful video hook scripts (first 15 seconds). Return JSON: {"hooks": ["..."]}',
};

export async function generateStudioContent(
  type: StudioContentType,
  prompt: string,
  channelContext?: string,
): Promise<Record<string, unknown>> {
  const systemPrompt = studioPrompts[type];
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an elite YouTube content strategist. Always respond with valid JSON only — no markdown, no extra text. ${systemPrompt}`,
    },
    {
      role: 'user',
      content: `Video concept / topic: ${prompt}${channelContext ? `\n\nChannel context: ${channelContext}` : ''}`,
    },
  ];

  const raw = await chatCompletion(messages);
  return parseJson<Record<string, unknown>>(raw, { error: 'Generation failed' });
}

export async function generateAllStudioContent(
  prompt: string,
  channelContext?: string,
): Promise<Record<StudioContentType, Record<string, unknown>>> {
  const types: StudioContentType[] = [
    'titles', 'descriptions', 'tags', 'keywords', 'hashtags',
    'scripts', 'communityPosts', 'shortIdeas', 'longVideoIdeas',
    'thumbnailText', 'pinnedComment', 'videoChapters', 'cta',
    'seoChecklist', 'titleVariations', 'descriptionVariations', 'hookIdeas',
  ];

  const results = await Promise.all(
    types.map(type => generateStudioContent(type, prompt, channelContext).catch(() => ({ error: 'Generation failed' }))),
  );

  return Object.fromEntries(types.map((t, i) => [t, results[i]])) as Record<StudioContentType, Record<string, unknown>>;
}
