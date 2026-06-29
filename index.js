const APP_NAME = "MediathekViewWeb MSX";
const APP_VERSION = "1.0.0";
const MEDIATHEK_QUERY_URL = "https://mediathekviewweb.de/api/query";

const DEFAULT_SEARCH_SIZE = 18;
const MAX_SEARCH_SIZE = 36;
const DEFAULT_DURATION_MIN = 15;
const SEARCH_CACHE_SECONDS = 300;
const STATIC_CACHE_SECONDS = 3600;
const LOGO_BASE_URL = "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/germany/";
const INPUT_PLUGIN_URL = "http://msx.benzac.de/interaction/input.html";
const APP_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#21d4fd"/><stop offset="1" stop-color="#b721ff"/></linearGradient></defs><rect width="512" height="512" rx="96" fill="#101820"/><path fill="url(#g)" d="M96 150c0-30 24-54 54-54h212c30 0 54 24 54 54v150c0 30-24 54-54 54H150c-30 0-54-24-54-54z"/><path fill="#fff" d="m228 178 104 70-104 70z"/><path fill="#21d4fd" d="M160 398h192v28H160z"/></svg>`;
const APP_BACKGROUND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="a" cx="25%" cy="20%" r="70%"><stop stop-color="#1f7aff" stop-opacity=".75"/><stop offset="1" stop-color="#101820" stop-opacity="0"/></radialGradient><radialGradient id="b" cx="78%" cy="28%" r="65%"><stop stop-color="#b721ff" stop-opacity=".55"/><stop offset="1" stop-color="#101820" stop-opacity="0"/></radialGradient><linearGradient id="c" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#0b1118"/><stop offset="1" stop-color="#172330"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#c)"/><rect width="1920" height="1080" fill="url(#a)"/><rect width="1920" height="1080" fill="url(#b)"/><g fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="2"><path d="M0 760c240-120 480-120 720 0s480 120 720 0 480-120 720 0"/><path d="M0 840c240-120 480-120 720 0s480 120 720 0 480-120 720 0"/></g></svg>`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const TEMPLATES = {
  heroControl: {
    type: "control",
    layout: "0,0,12,1",
    color: "msx-glass",
  },
  quickTile: {
    type: "separate",
    layout: "0,0,4,2",
    color: "msx-glass",
    enumerate: false,
    round: false,
  },
  channelTile: {
    type: "separate",
    layout: "0,0,4,2",
    color: "msx-glass",
    enumerate: false,
    imageFiller: "fit",
  },
  resultCard: {
    type: "separate",
    layout: "0,0,4,2",
    color: "msx-black-soft",
    round: false,
    compress: true,
    enumerate: false,
  },
  actionControl: {
    type: "control",
    layout: "0,0,4,2",
    color: "msx-glass",
  },
  optionControl: {
    type: "control",
    layout: "0,0,8,1",
    color: "msx-glass",
  },
};

const DOCU_SEARCH_FIELDS = "topic,title,description";

const QUICK_FILTERS = [
  {
    id: "latest",
    label: "Neue Dokus",
    icon: "view-list",
    color: "msx-blue-soft",
    params: {
      q: withDurationSyntax("doku", 20),
      fields: DOCU_SEARCH_FIELDS,
      group: "channel",
      sort: "timestamp",
      order: "desc",
    },
  },
  {
    id: "arte",
    label: "ARTE",
    icon: "palette",
    color: "msx-red-soft",
    params: { channel: "ARTE.DE", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
  },
  {
    id: "zdfinfo",
    label: "ZDFinfo",
    icon: "travel-explore",
    color: "msx-yellow-soft",
    params: { channel: "ZDFinfo", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
  },
  {
    id: "society",
    label: "Gesellschaft",
    icon: "groups",
    color: "msx-purple-soft",
    params: { q: withDurationSyntax("gesellschaft", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
  {
    id: "history",
    label: "Geschichte",
    icon: "history-edu",
    color: "msx-yellow-soft",
    params: { q: withDurationSyntax("geschichte", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
  {
    id: "science",
    label: "Wissenschaft",
    icon: "science",
    color: "msx-cyan-soft",
    params: { q: withDurationSyntax("wissenschaft", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
  {
    id: "politics",
    label: "Politik",
    icon: "account-balance",
    color: "msx-blue-soft",
    params: { q: withDurationSyntax("politik", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
  {
    id: "nature",
    label: "Natur",
    icon: "terrain",
    color: "msx-green-soft",
    params: { q: withDurationSyntax("natur", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
  {
    id: "true-crime",
    label: "True Crime",
    icon: "local-police",
    color: "msx-red-soft",
    params: { q: withDurationSyntax("true crime", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" },
  },
];

const DOCU_CHANNELS = [
  {
    id: "arte",
    label: "ARTE",
    icon: "palette",
    color: "msx-red-soft",
    params: { channel: "ARTE.DE", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Kultur, Gesellschaft, Wissenschaft und internationale Dokumentationen.",
  },
  {
    id: "zdfinfo",
    label: "ZDFinfo",
    icon: "travel-explore",
    color: "msx-yellow-soft",
    params: { channel: "ZDFinfo", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Reportagen, History, True Crime, Politik und Wissen.",
  },
  {
    id: "3sat",
    label: "3sat",
    icon: "theaters",
    color: "msx-red-soft",
    params: { channel: "3Sat", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Dokumentarfilm, Kultur, Gesellschaft und Wissen.",
  },
  {
    id: "phoenix",
    label: "phoenix",
    icon: "public",
    color: "msx-red-soft",
    params: { channel: "PHOENIX", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Politik, Zeitgeschichte und lange Dokumentationen.",
  },
  {
    id: "ard-alpha",
    label: "ARD alpha",
    icon: "school",
    color: "msx-blue-soft",
    params: { channel: "ARD alpha", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Bildung, Wissen und Wissenschaft.",
  },
  {
    id: "dw",
    label: "DW",
    icon: "public",
    color: "msx-blue-soft",
    params: { channel: "DW", q: withDurationSyntax("doku", 20), fields: DOCU_SEARCH_FIELDS },
    description: "Internationale Perspektiven und Reportagen.",
  },
];

const TOPIC_FILTERS = [
  { id: "society", label: "Gesellschaft", icon: "groups", color: "msx-purple-soft", params: { q: withDurationSyntax("gesellschaft", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "history", label: "Geschichte", icon: "history-edu", color: "msx-yellow-soft", params: { q: withDurationSyntax("geschichte", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "science", label: "Wissenschaft", icon: "science", color: "msx-cyan-soft", params: { q: withDurationSyntax("wissenschaft", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "politics", label: "Politik", icon: "account-balance", color: "msx-blue-soft", params: { q: withDurationSyntax("politik", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "nature", label: "Natur", icon: "terrain", color: "msx-green-soft", params: { q: withDurationSyntax("natur", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "true-crime", label: "True Crime", icon: "local-police", color: "msx-red-soft", params: { q: withDurationSyntax("true crime", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "culture", label: "Kultur", icon: "theaters", color: "msx-red-soft", params: { q: withDurationSyntax("kultur", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
  { id: "travel", label: "Reisen", icon: "explore", color: "msx-cyan-soft", params: { q: withDurationSyntax("reise", 20), fields: DOCU_SEARCH_FIELDS, group: "channel" } },
];

const CHANNEL_METADATA = [
  {
    aliases: ["3sat"],
    logo: "3sat-de.png",
    icon: "theaters",
    color: "msx-red-soft",
    description: "3sat Dokumentationen",
  },
  {
    aliases: ["ard", "das erste"],
    logo: "ard-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "ARD Mediathek",
  },
  {
    aliases: ["ard alpha", "ard-alpha", "ardalpha"],
    logo: "ard-alpha-de.png",
    icon: "school",
    color: "msx-blue-soft",
    description: "Bildung und Wissen",
  },
  {
    aliases: ["arte", "arte.de"],
    logo: "arte-de.png",
    icon: "palette",
    color: "msx-red-soft",
    description: "ARTE Dokumentationen",
  },
  {
    aliases: ["br", "br fernsehen"],
    logo: "br-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "BR Dokus und Reportagen",
  },
  {
    aliases: ["curiosity channel"],
    logo: "curiosity-channel-de.png",
    icon: "science",
    color: "msx-cyan-soft",
    description: "Wissen und Wissenschaft",
  },
  {
    aliases: ["curiosity now"],
    logo: "curiosity-now-de.png",
    icon: "science",
    color: "msx-cyan-soft",
    description: "Wissen und Wissenschaft",
  },
  {
    aliases: ["dmax"],
    logo: "dmax-de.png",
    icon: "engineering",
    color: "msx-yellow-soft",
    description: "Factual Entertainment",
  },
  {
    aliases: ["dw", "deutsche welle"],
    logo: "dw-de.png",
    icon: "public",
    color: "msx-blue-soft",
    description: "Internationale Reportagen",
  },
  {
    aliases: ["history"],
    logo: "history-de.png",
    icon: "history-edu",
    color: "msx-yellow-soft",
    description: "Geschichte und Zeitgeschehen",
  },
  {
    aliases: ["hr", "hr fernsehen"],
    logo: "hr-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "hr Dokus und Reportagen",
  },
  {
    aliases: ["kabel eins doku", "kabel 1 doku"],
    logo: "kabel-eins-doku-de.png",
    icon: "movie",
    color: "msx-green-soft",
    description: "Doku-Sender",
  },
  {
    aliases: ["n24 doku"],
    logo: "n24-doku-de.png",
    icon: "travel-explore",
    color: "msx-blue-soft",
    description: "Dokumentationen und Reportagen",
  },
  {
    aliases: ["national geographic"],
    logo: "national-geographic-de.png",
    icon: "terrain",
    color: "msx-yellow-soft",
    description: "Natur, Erde und Wissenschaft",
  },
  {
    aliases: ["ndr", "ndr fernsehen"],
    logo: "ndr-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "NDR Dokus und Reportagen",
  },
  {
    aliases: ["one terra"],
    logo: "one-terra-de.png",
    icon: "public",
    color: "msx-green-soft",
    description: "Natur und Reisen",
  },
  {
    aliases: ["one"],
    logo: "one-de.png",
    icon: "movie",
    color: "msx-purple-soft",
    description: "ONE Mediathek",
  },
  {
    aliases: ["phoenix"],
    logo: "phoenix-de.png",
    icon: "public",
    color: "msx-red-soft",
    description: "Politik und Zeitgeschichte",
  },
  {
    aliases: ["planet"],
    logo: "planet-de.png",
    icon: "public",
    color: "msx-green-soft",
    description: "Dokus und Wissen",
  },
  {
    aliases: ["mdr", "mdr fernsehen"],
    logo: "mdr-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "MDR Dokus und Reportagen",
  },
  {
    aliases: ["radio bremen", "radio bremen tv"],
    logo: "radio-bremen-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "Radio Bremen Dokus und Reportagen",
  },
  {
    aliases: ["rbb", "rbb fernsehen"],
    logo: "rbb-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "rbb Dokus und Reportagen",
  },
  {
    aliases: ["sr", "sr fernsehen"],
    logo: "sr-fernsehen-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "SR Dokus und Reportagen",
  },
  {
    aliases: ["swr", "swr fernsehen"],
    logo: "swr-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "SWR Dokus und Reportagen",
  },
  {
    aliases: ["wdr", "wdr fernsehen"],
    logo: "wdr-de.png",
    icon: "account-balance",
    color: "msx-blue-soft",
    description: "WDR Dokus und Reportagen",
  },
  {
    aliases: ["welt"],
    logo: "welt-de.png",
    icon: "travel-explore",
    color: "msx-blue-soft",
    description: "Nachrichten und Reportagen",
  },
  {
    aliases: ["welt der wunder"],
    logo: "welt-der-wunder-de.png",
    icon: "psychology",
    color: "msx-purple-soft",
    description: "Wissen und Entdeckungen",
  },
  {
    aliases: ["xplore"],
    logo: "xplore-de.png",
    icon: "explore",
    color: "msx-cyan-soft",
    description: "Entdeckungen und Reisen",
  },
  {
    aliases: ["zdf"],
    logo: "zdf-de.png",
    icon: "account-balance",
    color: "msx-yellow-soft",
    description: "ZDF Mediathek",
  },
  {
    aliases: ["zdfinfo", "zdf info"],
    logo: "zdf-info-de.png",
    icon: "travel-explore",
    color: "msx-yellow-soft",
    description: "ZDFinfo Dokus",
  },
  {
    aliases: ["zdfneo", "zdf neo"],
    logo: "zdf-neo-de.png",
    icon: "movie",
    color: "msx-yellow-soft",
    description: "ZDFneo",
  },
];

const CHANNEL_COLORS = [
  "msx-blue-soft",
  "msx-green-soft",
  "msx-red-soft",
  "msx-yellow-soft",
  "msx-purple-soft",
  "msx-cyan-soft",
];

const GENERAL_EXCLUDE_PATTERNS = [
  /\btrailer\b/i,
  /\bteaser\b/i,
  /\bpreview\b/i,
  /\bvorschau\b/i,
  /\bmaking of\b/i,
  /\bouttake\b/i,
  /\bclip\b/i,
  /\bausschnitt\b/i,
  /\bbonus\b/i,
  /\bmit untertitel\b/i,
];

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};

export async function handleRequest(request, env = {}, ctx = {}) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const pathname = normalizePath(url.pathname);

  try {
    if (pathname === "/" || pathname === "/index.html") {
      return htmlResponse(buildLandingPage(request));
    }

    if (pathname === "/health") {
      return jsonResponse(buildHealth(request), { cacheSeconds: 30 });
    }

    if (pathname === "/assets/logo.svg") {
      return staticAssetResponse(APP_LOGO_SVG, "image/svg+xml; charset=utf-8");
    }

    if (pathname === "/assets/background.svg") {
      return staticAssetResponse(APP_BACKGROUND_SVG, "image/svg+xml; charset=utf-8");
    }

    if (pathname === "/msx/start.json") {
      return jsonResponse(buildStart(request), { cacheSeconds: STATIC_CACHE_SECONDS });
    }

    if (pathname === "/msx/menu.json") {
      return jsonResponse(buildMenu(request), { cacheSeconds: STATIC_CACHE_SECONDS });
    }

    if (pathname === "/msx/search") {
      return cacheable(request, ctx, SEARCH_CACHE_SECONDS, () => handleSearch(request));
    }

    if (pathname === "/msx/search-action") {
      return handleSearchAction(request);
    }

    if (pathname === "/msx/play") {
      return handlePlayAction(request);
    }

    if (pathname === "/msx/resolve") {
      return handleResolve(request);
    }

    if (pathname === "/api/query") {
      return handleQueryProxy(request);
    }

    return jsonResponse(
      {
        error: "Not Found",
        endpoints: Object.keys(buildHealth(request).endpoints),
      },
      { status: 404 },
    );
  } catch (error) {
    return jsonResponse(
      {
        error: "Worker error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500, cacheSeconds: 0 },
    );
  }
}

export function buildStart(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    parameter: `menu:${absoluteUrl(request, "/msx/menu.json")}`,
    style: "flat-separator",
    logo: absoluteUrl(request, "/assets/logo.svg"),
    logoSize: "medium",
    background: absoluteUrl(request, "/assets/background.svg"),
    transparent: true,
    refocus: true,
    restore: true,
    cache: true,
    welcome: "none",
    launcher: {
      icon: "play-circle-outline",
      color: "msx-black-soft",
    },
    note: "Media Station X 0.1.166 or higher is recommended.",
  };
}

export function buildMenu(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-menu",
    cache: true,
    restore: true,
    refocus: true,
    style: "flat-separator",
    logo: absoluteUrl(request, "/assets/logo.svg"),
    logoSize: "medium",
    background: absoluteUrl(request, "/assets/background.svg"),
    transparent: true,
    headline: "Mediathek Dokus",
    menu: [
      {
        id: "search",
        icon: "search",
        label: "🔍 Suche",
        focus: true,
        data: buildSearchPromptContent(request),
      },
      {
        id: "channels",
        icon: "apps",
        label: "📺 Sender",
        data: buildDocuChannelsContent(request),
      },
      {
        id: "topics",
        icon: "science",
        label: "🧪 Themen",
        data: buildTopicsContent(request),
      },
      {
        id: "latest",
        icon: "star",
        label: "⭐ Neu",
        data: absoluteUrl(request, "/msx/search", {
          q: withDurationSyntax("doku", 20),
          fields: DOCU_SEARCH_FIELDS,
          sort: "timestamp",
          order: "desc",
          size: MAX_SEARCH_SIZE,
        }),
      },
      {
        id: "favorites",
        icon: "favorite",
        label: "❤️ Favoriten",
        data: buildFavoritesContent(request),
      },
      {
        id: "settings",
        type: "settings",
        icon: "settings",
        label: "⚙ Einstellungen",
      },
    ],
  };
}

function buildSearchPromptContent(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-search",
    cache: false,
    restore: false,
    type: "list",
    headline: "Doku Suche",
    template: {
      color: "msx-glass",
      enumerate: false,
    },
    items: [
      {
        ...TEMPLATES.heroControl,
        id: "search-input",
        icon: "search",
        label: "Was möchtest du sehen?",
        action: buildSearchInputAction(request),
      },
      ...QUICK_FILTERS.map((filter) => ({
        ...TEMPLATES.quickTile,
        id: `quick-${filter.id}`,
        icon: filter.icon,
        badge: "Schnellfilter",
        badgeColor: filter.color,
        title: filter.label,
        titleFooter: "Direkt zur Ergebnisliste",
        action: `content:${absoluteUrl(request, "/msx/search", {
          ...filter.params,
          size: filter.id === "latest" ? MAX_SEARCH_SIZE : DEFAULT_SEARCH_SIZE,
        })}`,
      })),
    ],
  };
}

function buildDocuChannelsContent(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-docu-channels",
    cache: false,
    restore: true,
    type: "list",
    headline: "Doku-Sender",
    template: TEMPLATES.channelTile,
    items: DOCU_CHANNELS.map((channel) => {
      const meta = getChannelMeta(channel.params.channel);
      return {
        id: `channel-${channel.id}`,
        icon: channel.icon || meta.icon,
        image: meta.logoUrl,
        badge: "Doku",
        badgeColor: channel.color || meta.color,
        title: channel.label,
        titleHeader: meta.description,
        text: channel.description,
        action: `content:${absoluteUrl(request, "/msx/search", {
          ...channel.params,
          size: DEFAULT_SEARCH_SIZE,
        })}`,
      };
    }),
  };
}

function buildTopicsContent(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-topics",
    cache: false,
    restore: true,
    type: "list",
    headline: "Themen",
    template: {
      type: "separate",
      layout: "0,0,6,2",
      color: "msx-glass",
      enumerate: false,
    },
    items: TOPIC_FILTERS.map((filter) => ({
      id: `topic-${filter.id}`,
      icon: filter.icon,
      badgeColor: filter.color,
      title: filter.label,
      titleHeader: "Schnellzugriff",
      text: "Dokumentationen und Reportagen direkt zu diesem Thema anzeigen.",
      action: `content:${absoluteUrl(request, "/msx/search", {
        ...filter.params,
        size: DEFAULT_SEARCH_SIZE,
      })}`,
    })),
  };
}

function buildFavoritesContent(request) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-favorites",
    cache: false,
    restore: true,
    type: "list",
    headline: "Favoriten",
    template: {
      type: "separate",
      layout: "0,0,12,2",
      color: "msx-glass",
    },
    items: [
      {
        id: "favorites-placeholder",
        icon: "favorite-border",
        title: "Favoriten vorbereiten",
        titleHeader: "Noch keine lokalen Favoriten",
        text: "Hier ist Platz fuer ein MSX-Local-Storage- oder Optionen-Konzept, um Sendungen spaeter lokal zu merken.",
        action: buildSearchInputAction(request),
      },
    ],
  };
}

function buildSearchInputAction(request, initInput = "") {
  const serviceUrl = absoluteUrl(request, "/msx/search", {
    q: withDurationSyntax("{INPUT}", DEFAULT_DURATION_MIN),
    fields: "topic,title,description",
    group: "channel",
    size: DEFAULT_SEARCH_SIZE,
  }).replace("%7BINPUT%7D", "{INPUT}");

  const inputOptions = [
    "search",
    "de",
    "Doku Suche",
    "",
    "",
    "Suchbegriff, Sender oder Thema eingeben",
    "Natur, Geschichte, ARTE, ZDFinfo",
    String(MAX_SEARCH_SIZE),
    initInput,
  ].join("|");

  return `content:request:interaction:${serviceUrl}|${inputOptions}@${INPUT_PLUGIN_URL}`;
}

function buildInfoContent(request) {
  const startUrl = absoluteUrl(request, "/msx/start.json");
  const menuUrl = absoluteUrl(request, "/msx/menu.json");

  return {
    name: APP_NAME,
    version: APP_VERSION,
    type: "list",
    headline: "Worker Info",
    template: {
      type: "separate",
      layout: "0,0,12,2",
      color: "msx-glass",
    },
    items: [
      {
        id: "about-worker",
        icon: "info",
        title: APP_NAME,
        titleHeader: `Version ${APP_VERSION}`,
        text: [
          "Cloudflare Worker fuer Media Station X.",
          "Der Worker liefert Start-, Menu-, Content-, Search-, Play- und Resolve-Endpunkte.",
        ],
      },
      {
        id: "open-health",
        type: "control",
        icon: "link",
        label: "Health JSON oeffnen",
        action: `link:window:${absoluteUrl(request, "/health")}`,
      },
      {
        id: "copy-start",
        type: "separate",
        icon: "play-circle-outline",
        title: "Start JSON",
        text: startUrl,
        action: `link:window:${startUrl}`,
      },
      {
        id: "copy-menu",
        type: "separate",
        icon: "menu",
        title: "Menu JSON",
        text: menuUrl,
        action: `link:window:${menuUrl}`,
      },
    ],
  };
}

async function handleSearch(request) {
  const url = new URL(request.url);
  const mediathekQuery = buildMediathekQuery(url.searchParams);
  const upstream = await fetchMediathek(mediathekQuery);

  if (upstream.err) {
    return jsonResponse(buildErrorContent("MediathekViewWeb Fehler", upstream.err.join("\n")), {
      cacheSeconds: 30,
    });
  }

  return jsonResponse(buildSearchContent(request, mediathekQuery, upstream.result), {
    cacheSeconds: SEARCH_CACHE_SECONDS,
  });
}

async function handleSearchAction(request) {
  const payload = await readMsxPayload(request);
  const code = cleanString(payload.input || payload.code || payload.value || payload.query || payload.data?.query);

  if (!code) {
    return jsonResponse(msxResponse(400, "Bad Request", null, "Bitte Suchbegriff eingeben."), {
      cacheSeconds: 0,
    });
  }

  const searchUrl = absoluteUrl(request, "/msx/search", {
    q: withDurationSyntax(code, DEFAULT_DURATION_MIN),
    size: DEFAULT_SEARCH_SIZE,
    sort: "timestamp",
    order: "desc",
  });

  return jsonResponse(msxResponse(200, "OK", { action: `content:${searchUrl}` }), {
    cacheSeconds: 0,
  });
}

async function handlePlayAction(request) {
  const payload = await readMsxPayload(request);
  const data = payload.data && typeof payload.data === "object" ? payload.data : payload;
  const quality = cleanString(data.quality || "hd").toLowerCase();
  const url = selectUrlFromPayload(data, quality);

  if (!url) {
    return jsonResponse(msxResponse(404, "Not Found", null, "Kein abspielbarer Video-Link vorhanden."), {
      cacheSeconds: 0,
    });
  }

  return jsonResponse(
    msxResponse(200, "OK", {
      action: `video:${url}`,
      data: {
        playerLabel: cleanString(data.title) || APP_NAME,
        background: cleanString(data.background) || undefined,
        properties: data.properties || undefined,
      },
    }),
    { cacheSeconds: 0 },
  );
}

function handleResolve(request) {
  const url = new URL(request.url);
  const mediaUrl = cleanString(url.searchParams.get("url"));
  const label = cleanString(url.searchParams.get("label")) || APP_NAME;
  const background = cleanString(url.searchParams.get("background"));

  if (!mediaUrl) {
    return jsonResponse(msxResponse(404, "Not Found", { error: "Missing url parameter" }), {
      cacheSeconds: 0,
    });
  }

  return jsonResponse(
    msxResponse(200, "OK", {
      url: mediaUrl,
      label,
      background: background || undefined,
    }),
    { cacheSeconds: 60 },
  );
}

async function handleQueryProxy(request) {
  let query;

  if (request.method === "GET") {
    query = buildMediathekQuery(new URL(request.url).searchParams);
  } else if (request.method === "POST") {
    const body = await request.text();
    query = body ? JSON.parse(body) : buildMediathekQuery(new URLSearchParams());
  } else {
    return jsonResponse({ result: null, err: [`Method ${request.method} not allowed`] }, { status: 405 });
  }

  const upstream = await fetchMediathek(query);
  return jsonResponse(sanitizeScannedPages(upstream), { cacheSeconds: request.method === "GET" ? SEARCH_CACHE_SECONDS : 0 });
}

export function buildMediathekQuery(searchParams) {
  const params = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams);
  const queries = [];
  const rawSearch = params.get("input") || params.get("q") || params.get("query") || "";
  const syntax = parseSearchSyntax(rawSearch, parseBoolean(params.get("everywhere")));

  queries.push(...syntax.queries);
  appendFieldQuery(queries, "channel", params.getAll("channel"));
  appendFieldQuery(queries, "topic", params.getAll("topic"));
  appendFieldQuery(queries, "title", params.getAll("title"));
  appendFieldQuery(queries, "description", params.getAll("description"));

  const fields = parseFields(params.get("fields"));
  const plainQuery = cleanString(params.get("text"));
  if (plainQuery) {
    queries.push({ fields, query: plainQuery });
  }

  const durationMin = firstNumber(params.get("duration_min"), syntax.duration_min) ?? DEFAULT_DURATION_MIN;
  const durationMax = firstNumber(params.get("duration_max"), syntax.duration_max);
  const size = clampInteger(params.get("size") || params.get("limit"), DEFAULT_SEARCH_SIZE, 1, MAX_SEARCH_SIZE);
  const offset = clampInteger(params.get("offset"), 0, 0, 10000);

  const query = {
    queries: dedupeQueries(queries),
    sortBy: normalizeSort(params.get("sort") || params.get("sortBy")),
    sortOrder: normalizeOrder(params.get("order") || params.get("sortOrder")),
    future: parseBoolean(params.get("future")),
    offset,
    size,
  };

  if (durationMin !== null) query.duration_min = minutesToSeconds(durationMin);
  if (durationMax !== null) query.duration_max = minutesToSeconds(durationMax);

  return query;
}

function parseSearchSyntax(rawQuery, everywhere = false) {
  const tokens = cleanString(rawQuery).split(/\s+/).filter(Boolean);
  const general = [];
  const queries = [];
  let duration_min = null;
  let duration_max = null;

  for (const token of tokens) {
    const prefix = token[0];
    const value = cleanString(token.slice(1));

    if ((prefix === ">" || prefix === "<") && /^\d+$/.test(value)) {
      if (prefix === ">") duration_min = Math.max(duration_min ?? 0, Number(value));
      if (prefix === "<") duration_max = Number(value);
      continue;
    }

    if (prefix === "!" && value) {
      queries.push({ fields: ["channel"], query: normalizeSearchValue(value) });
      continue;
    }

    if (prefix === "#" && value) {
      queries.push({ fields: ["topic"], query: normalizeSearchValue(value) });
      continue;
    }

    if (prefix === "+" && value) {
      queries.push({ fields: ["title"], query: normalizeSearchValue(value) });
      continue;
    }

    if (prefix === "*" && value) {
      queries.push({ fields: ["description"], query: normalizeSearchValue(value) });
      continue;
    }

    general.push(token);
  }

  if (general.length > 0) {
    queries.push({
      fields: everywhere ? ["channel", "topic", "title", "description"] : ["topic", "title"],
      query: normalizeSearchValue(general.join(" ")),
    });
  }

  return { queries, duration_min, duration_max };
}

function withDurationSyntax(query, durationMin) {
  const clean = cleanString(query);
  if (!durationMin) return clean;
  if (!clean) return `>${durationMin}`;
  if (/(^|\s)>\d+(\s|$)/.test(clean)) return clean;
  return `${clean} >${durationMin}`;
}

function isValidMediathekResult(item) {
  const title = cleanString(item?.title);

  if (title.length < 4) return false;
  if (!chooseVideoUrl(
    {
      hd: cleanString(item?.url_video_hd),
      sd: cleanString(item?.url_video),
      low: cleanString(item?.url_video_low),
    },
    "hd",
  )) {
    return false;
  }

  const haystack = normalizeFilterText(title);
  return !GENERAL_EXCLUDE_PATTERNS.some((pattern) => pattern.test(haystack));
}

function buildSearchContent(request, mediathekQuery, result) {
  const sourceUrl = new URL(request.url);
  const queryInfo = result?.queryInfo || result?.query_info || {};
  const results = Array.isArray(result?.results) ? result.results : [];
  const quality = cleanString(sourceUrl.searchParams.get("quality") || "hd").toLowerCase();
  const offset = Number(mediathekQuery.offset || 0);
  const size = Number(mediathekQuery.size || DEFAULT_SEARCH_SIZE);
  const total = Number(queryInfo.totalResults || queryInfo.resultCount || results.length || 0);
  const resultItems = results
    .filter(isValidMediathekResult)
    .map((item, index) => buildMediathekItem(request, item, index, quality))
    .filter(Boolean);
  const items =
    sourceUrl.searchParams.get("group") === "channel" ? groupItemsByChannel(resultItems) : resultItems;

  if (items.length === 0) {
    items.push({
      id: "no-results",
      icon: "info",
      title: "Keine Ergebnisse",
      text: "Bitte Suchbegriff oder Filter anpassen.",
      color: "msx-glass",
    });
  }

  if (results.length === size && offset + size < total) {
    const nextParams = new URLSearchParams(sourceUrl.searchParams);
    nextParams.set("offset", String(offset + size));
    nextParams.set("size", String(size));
    items.push({
      ...TEMPLATES.actionControl,
      id: "more-results",
      icon: "plus",
      label: `Mehr laden (${offset + size}/${formatCount(total, queryInfo.totalRelation)})`,
      action: `content:${absoluteUrl(request, "/msx/search", nextParams)}`,
    });
  }

  items.push({
    ...TEMPLATES.actionControl,
    id: "new-search",
    icon: "search",
    label: "Neue Suche",
    action: buildSearchInputAction(request, sourceUrl.searchParams.get("input") || sourceUrl.searchParams.get("q") || ""),
  });

  return {
    name: APP_NAME,
    version: APP_VERSION,
    flag: "mediathekviewweb-msx-results",
    cache: false,
    restore: true,
    refocus: true,
    type: "list",
    headline: buildHeadline(sourceUrl, queryInfo),
    extension: buildExtension(queryInfo),
    template: TEMPLATES.resultCard,
    items,
  };
}

function buildMediathekItem(request, item, index, quality) {
  const urls = {
    hd: cleanString(item.url_video_hd),
    sd: cleanString(item.url_video),
    low: cleanString(item.url_video_low),
  };
  const selectedUrl = chooseVideoUrl(urls, quality);

  if (!selectedUrl) return null;

  const title = cleanString(item.title);
  const channel = cleanString(item.channel) || "Mediathek";
  const topic = cleanString(item.topic);
  const website = cleanString(item.url_website);
  const description = cleanString(item.description);
  const duration = formatDuration(item.duration);
  const date = formatDate(item.timestamp);
  const titleHeader = topic || channel;
  const channelMeta = getChannelMeta(channel);
  const previewImage = selectMediathekImage(item);
  const image = previewImage || channelMeta.logoUrl;
  const hasPreviewImage = Boolean(previewImage);
  const titleFooter = [channel, duration, date].filter(Boolean).join(" • ");
  const docuIcon = selectDocumentaryIcon(`${topic} ${title} ${description}`) || channelMeta.icon;

  return {
    ...TEMPLATES.resultCard,
    id: createItemId(item, index),
    icon: image ? undefined : docuIcon,
    iconSize: image ? undefined : "small",
    image,
    imageFiller: hasPreviewImage ? "cover" : "fit",
    imageWidth: hasPreviewImage ? undefined : channelMeta.logoUrl ? 0.95 : -1,
    imageOverlay: hasPreviewImage ? 0.35 : 0,
    imageColor: "msx-black",
    badge: topic || channel,
    badgeColor: channelMeta.color || channelColor(channel),
    title,
    titleHeader,
    titleFooter,
    alignment: "title-left",
    truncation: "title|titleFooter",
    action: `execute:${absoluteUrl(request, "/msx/play")}`,
    data: {
      title,
      channel,
      topic,
      website,
      timestamp: item.timestamp,
      duration: item.duration,
      url: selectedUrl,
      urls,
      subtitle: cleanString(item.url_subtitle) || undefined,
      quality,
    },
    options: buildItemOptions(request, {
      title,
      website,
      urls,
      selectedUrl,
    }),
  };
}

function groupItemsByChannel(items) {
  return [...items].sort((a, b) => {
    const channelCompare = cleanString(a.data?.channel).localeCompare(cleanString(b.data?.channel), "de");
    if (channelCompare !== 0) return channelCompare;
    return Number(b.data?.timestamp || 0) - Number(a.data?.timestamp || 0);
  });
}

function buildItemOptions(request, item) {
  const items = [
    {
      id: "play-default",
      icon: "play-arrow",
      label: "Abspielen",
      action: `video:${item.selectedUrl}`,
      playerLabel: item.title,
    },
  ];

  if (item.urls.hd && item.urls.hd !== item.selectedUrl) {
    items.push({
      id: "play-hd",
      icon: "high-quality",
      label: "HD",
      action: `video:${item.urls.hd}`,
      playerLabel: `${item.title} (HD)`,
    });
  }

  if (item.urls.sd && item.urls.sd !== item.selectedUrl) {
    items.push({
      id: "play-sd",
      icon: "movie",
      label: "SD",
      action: `video:${item.urls.sd}`,
      playerLabel: `${item.title} (SD)`,
    });
  }

  if (item.urls.low && item.urls.low !== item.selectedUrl) {
    items.push({
      id: "play-low",
      icon: "movie",
      label: "Niedrig",
      action: `video:${item.urls.low}`,
      playerLabel: `${item.title} (Low)`,
    });
  }

  if (item.website) {
    items.push({
      id: "open-website",
      icon: "link",
      label: "Mediathek",
      action: `link:window:${item.website}`,
    });
  }

  items.push({
    id: "resolve-test",
    icon: "settings",
    label: "Resolve",
    action: `video:resolve:${absoluteUrl(request, "/msx/resolve", {
      url: item.selectedUrl,
      label: item.title,
    })}`,
  });

  return {
    caption: "Optionen",
    template: TEMPLATES.optionControl,
    items,
  };
}

async function fetchMediathek(query) {
  const response = await fetch(MEDIATHEK_QUERY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      Accept: "application/json",
      "User-Agent": "cf-msx-mediathek-worker/1.0",
    },
    body: JSON.stringify(query),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { result: null, err: [`Invalid upstream JSON: ${text.slice(0, 120)}`] };
  }

  if (!response.ok) {
    return {
      result: null,
      err: [`MediathekViewWeb returned HTTP ${response.status}`, ...(data.err || [])],
    };
  }

  return data;
}

async function readMsxPayload(request) {
  const body = await request.text();
  if (!body) return {};

  const trimmed = body.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch {
    const params = new URLSearchParams(trimmed);
    const payload = {};
    for (const [key, value] of params) {
      payload[key] = parseMaybeJson(value);
    }
    return payload;
  }
}

function parseMaybeJson(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function sanitizeScannedPages(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeScannedPages);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (key === "scannedPages" && Array.isArray(item)) {
        return [key, item.filter(isStreamsScanPage)];
      }
      return [key, sanitizeScannedPages(item)];
    }),
  );
}

function isStreamsScanPage(value) {
  const page = cleanString(value);
  if (!page) return false;

  try {
    const url = new URL(page, "https://www.fernsehserien.de");
    return isStreamsPath(url.pathname);
  } catch {
    return isStreamsPath(page.split(/[?#]/, 1)[0]);
  }
}

function isStreamsPath(pathname) {
  const path = cleanString(pathname).replace(/\/+$/g, "");
  return path === "/streams" || path.endsWith("/streams");
}

function msxResponse(status, text, data = null, message = null) {
  return {
    response: {
      status,
      text,
      message,
      data,
    },
  };
}

async function cacheable(request, ctx, ttl, produce) {
  if (request.method !== "GET" || typeof caches === "undefined") {
    return produce();
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const hit = new Response(cached.body, cached);
    hit.headers.set("X-Worker-Cache", "HIT");
    return hit;
  }

  const response = await produce();
  const miss = new Response(response.body, response);
  miss.headers.set("X-Worker-Cache", "MISS");

  if (miss.ok) {
    const cacheCopy = miss.clone();
    const put = cache.put(cacheKey, cacheCopy);
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(put);
    } else {
      await put;
    }
  }

  return miss;
}

function jsonResponse(data, options = {}) {
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");

  if (typeof options.cacheSeconds === "number") {
    headers.set("Cache-Control", `public, max-age=${Math.max(0, options.cacheSeconds)}`);
  } else {
    headers.set("Cache-Control", "no-store");
  }

  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers,
  });
}

function staticAssetResponse(body, contentType) {
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", `public, max-age=${STATIC_CACHE_SECONDS}`);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(body, { headers });
}

function htmlResponse(html) {
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=300");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(html, { headers });
}

function buildLandingPage(request) {
  const startUrl = absoluteUrl(request, "/msx/start.json");
  const launchUrl = `https://msx.benzac.de/?start=menu:${absoluteUrl(request, "/msx/menu.json")}`;

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(APP_NAME)}</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #101820; color: #f6f7f8; }
    main { max-width: 880px; margin: 0 auto; padding: 48px 20px; }
    h1 { font-size: clamp(2rem, 6vw, 4rem); line-height: 1; margin: 0 0 16px; letter-spacing: 0; }
    p { color: #c9d2d8; font-size: 1.05rem; line-height: 1.6; max-width: 680px; }
    a { color: #8ad4ff; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 28px 0; }
    .button { border: 1px solid #5b6b75; border-radius: 6px; padding: 10px 14px; color: #f6f7f8; text-decoration: none; background: #1d2a33; }
    code { background: #1d2a33; border: 1px solid #31424d; border-radius: 4px; padding: 2px 6px; }
    dl { display: grid; grid-template-columns: minmax(120px, 180px) 1fr; gap: 10px 16px; margin-top: 32px; }
    dt { color: #8fa3af; }
    dd { margin: 0; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(APP_NAME)}</h1>
    <p>Cloudflare Worker fuer ein Media Station X Doku-Showcase auf Basis der MediathekViewWeb-Suche.</p>
    <div class="actions">
      <a class="button" href="${escapeAttribute(launchUrl)}">In MSX Web starten</a>
      <a class="button" href="${escapeAttribute(startUrl)}">Start JSON</a>
      <a class="button" href="${escapeAttribute(absoluteUrl(request, "/health"))}">Health</a>
    </div>
    <dl>
      <dt>MSX Setup</dt>
      <dd><code>${escapeHtml(startUrl)}</code></dd>
      <dt>Start Parameter</dt>
      <dd><code>menu:${escapeHtml(absoluteUrl(request, "/msx/menu.json"))}</code></dd>
      <dt>Beispiel Suche</dt>
      <dd><a href="${escapeAttribute(absoluteUrl(request, "/msx/search", { q: withDurationSyntax("doku", DEFAULT_DURATION_MIN), group: "channel" }))}">${escapeHtml(absoluteUrl(request, "/msx/search", { q: withDurationSyntax("doku", DEFAULT_DURATION_MIN), group: "channel" }))}</a></dd>
    </dl>
  </main>
</body>
</html>`;
}

function buildHealth(request) {
  return {
    ok: true,
    name: APP_NAME,
    version: APP_VERSION,
    upstream: MEDIATHEK_QUERY_URL,
    endpoints: {
      start: absoluteUrl(request, "/msx/start.json"),
      menu: absoluteUrl(request, "/msx/menu.json"),
      search: absoluteUrl(request, "/msx/search", { q: withDurationSyntax("doku", DEFAULT_DURATION_MIN), group: "channel" }),
      searchAction: absoluteUrl(request, "/msx/search-action"),
      playAction: absoluteUrl(request, "/msx/play"),
      resolve: absoluteUrl(request, "/msx/resolve", { url: "https://example.com/video.mp4" }),
      queryProxy: absoluteUrl(request, "/api/query"),
    },
  };
}

function buildErrorContent(headline, message) {
  return {
    name: APP_NAME,
    version: APP_VERSION,
    type: "list",
    headline,
    template: {
      type: "separate",
      layout: "0,0,12,2",
      color: "msx-red-soft",
    },
    items: [
      {
        id: "error",
        icon: "warning",
        title: headline,
        text: message || "Unbekannter Fehler.",
      },
    ],
  };
}

function buildHeadline(sourceUrl, queryInfo) {
  const q = sourceUrl.searchParams.get("input") || sourceUrl.searchParams.get("q") || sourceUrl.searchParams.get("query");
  if (q) return `Suche: ${q}`;

  const channel = sourceUrl.searchParams.get("channel");
  if (channel) return `Sender: ${channel}`;

  const topic = sourceUrl.searchParams.get("topic");
  if (topic) return `Thema: ${topic}`;

  const count = queryInfo.resultCount || queryInfo.totalResults;
  return count ? `Doku Mediathek (${formatCount(count, queryInfo.totalRelation)})` : "Doku Mediathek";
}

function buildExtension(queryInfo) {
  const count = queryInfo.totalResults || queryInfo.resultCount;
  const time = queryInfo.searchEngineTime;
  const parts = [];
  if (count) parts.push(`${formatCount(count, queryInfo.totalRelation)} Treffer`);
  if (time) parts.push(`${time} ms`);
  return parts.join(" | ") || null;
}

function absoluteUrl(request, path, params = undefined) {
  const origin = new URL(request.url).origin;
  const url = new URL(path, origin);

  if (params instanceof URLSearchParams) {
    url.search = params.toString();
  } else if (params && typeof params === "object") {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function appendFieldQuery(queries, field, values) {
  for (const value of expandValues(values)) {
    const clean = normalizeSearchValue(value);
    if (clean) queries.push({ fields: [field], query: clean });
  }
}

function expandValues(values) {
  return values
    .flatMap((value) => String(value || "").split("|"))
    .map((value) => value.trim())
    .filter(Boolean);
}

function dedupeQueries(queries) {
  const seen = new Set();
  const deduped = [];

  for (const query of queries) {
    const fields = parseFields(query.fields).sort();
    const value = cleanString(query.query);
    if (!value) continue;
    const key = `${fields.join(",")}:${value.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({ fields, query: value });
  }

  return deduped;
}

function parseFields(fields) {
  const parsed = Array.isArray(fields)
    ? fields.filter(isValidQueryField)
    : cleanString(fields)
        .split(",")
        .map((field) => field.trim())
        .filter(isValidQueryField);

  return parsed.length > 0 ? parsed : ["topic", "title"];
}

function isValidQueryField(field) {
  return ["channel", "topic", "title", "description"].includes(field);
}

function normalizeSearchValue(value) {
  return cleanString(value).replaceAll(",", " ");
}

function normalizeSort(value) {
  return ["timestamp", "duration", "channel"].includes(value) ? value : "timestamp";
}

function normalizeOrder(value) {
  return value === "asc" ? "asc" : "desc";
}

function firstNumber(primary, fallback) {
  if (primary !== null && primary !== undefined && String(primary).trim() !== "") {
    const parsed = Number(primary);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return Number.isFinite(fallback) && fallback >= 0 ? fallback : null;
}

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function minutesToSeconds(minutes) {
  return Math.round(Number(minutes) * 60);
}

function parseBoolean(value) {
  return value === "1" || value === "true" || value === "yes";
}

function getChannelMeta(channel) {
  const normalized = normalizeChannel(channel);
  const metadata = CHANNEL_METADATA.find((entry) => entry.aliases.some((alias) => normalizeChannel(alias) === normalized));

  if (!metadata) {
    return {
      icon: "movie",
      logoUrl: "",
      color: channelColor(channel),
      description: "Mediathek Doku",
    };
  }

  return {
    ...metadata,
    logoUrl: metadata.logo ? `${LOGO_BASE_URL}${metadata.logo}` : "",
  };
}

function normalizeChannel(channel) {
  return cleanString(channel)
    .toLowerCase()
    .replaceAll(".", " ")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function selectDocumentaryIcon(text) {
  const normalized = cleanString(text).toLowerCase();
  if (matchesAny(normalized, ["natur", "wildnis", "erde", "klima", "tier", "wald", "meer"])) return "terrain";
  if (matchesAny(normalized, ["geschichte", "history", "archiv", "krieg", "zeitgeschichte"])) return "history-edu";
  if (matchesAny(normalized, ["wissenschaft", "medizin", "technik", "labor", "forschung"])) return "science";
  if (matchesAny(normalized, ["kunst", "kultur", "musik", "theater", "film"])) return "palette";
  if (matchesAny(normalized, ["politik", "gesellschaft", "macht", "wahl", "parlament"])) return "public";
  if (matchesAny(normalized, ["crime", "krimi", "fall", "schuld", "mord", "true crime"])) return "gavel";
  if (matchesAny(normalized, ["reise", "welt", "land", "stadt"])) return "travel-explore";
  return "";
}

function matchesAny(value, terms) {
  return terms.some((term) => value.includes(term));
}

function chooseVideoUrl(urls, quality) {
  if (quality === "low") return urls.low || urls.sd || urls.hd;
  if (quality === "sd") return urls.sd || urls.hd || urls.low;
  return urls.hd || urls.sd || urls.low;
}

function selectUrlFromPayload(data, quality) {
  if (data.urls && typeof data.urls === "object") {
    return chooseVideoUrl(
      {
        hd: cleanString(data.urls.hd),
        sd: cleanString(data.urls.sd),
        low: cleanString(data.urls.low),
      },
      quality,
    );
  }
  return cleanString(data.url);
}

function selectMediathekImage(item) {
  return [
    item?.image,
    item?.thumbnail,
    item?.thumbnailUrl,
    item?.thumbnail_url,
    item?.url_thumbnail,
    item?.url_image,
    item?.url_image_web,
    item?.urlImage,
    item?.urlImageWeb,
    item?.images,
    item?.thumbnails,
  ]
    .map(extractImageUrl)
    .find(Boolean) || "";
}

function extractImageUrl(value) {
  if (typeof value === "string") return isHttpUrl(value) ? value.trim() : "";

  if (Array.isArray(value)) {
    return value.map(extractImageUrl).find(Boolean) || "";
  }

  if (value && typeof value === "object") {
    return [
      value.url,
      value.src,
      value.href,
      value.large,
      value.medium,
      value.small,
      value.default,
    ]
      .map(extractImageUrl)
      .find(Boolean) || "";
  }

  return "";
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(cleanString(value));
}

function createItemId(item, index) {
  const raw = cleanString(item.id) || `${item.channel}-${item.topic}-${item.title}-${item.timestamp}-${index}`;
  return `mv-${raw.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 64) || index}`;
}

function slugify(value) {
  return cleanString(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "channel";
}

function channelColor(channel) {
  let hash = 0;
  for (const char of channel) hash = (hash + char.charCodeAt(0)) % CHANNEL_COLORS.length;
  return CHANNEL_COLORS[hash];
}

function formatDuration(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} Min`;
  const hours = Math.floor(minutes / 60);
  const minuteRest = minutes % 60;
  return minuteRest > 0 ? `${hours} Std ${minuteRest} Min` : `${hours} Std`;
}

function formatDate(timestamp) {
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(seconds * 1000));
}

function formatCount(count, relation) {
  const value = Number(count);
  if (!Number.isFinite(value)) return "0";
  return relation === "gte" ? `${value}+` : String(value);
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFilterText(value) {
  return cleanString(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizePath(pathname) {
  if (!pathname || pathname === "") return "/";
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
