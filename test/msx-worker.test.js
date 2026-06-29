import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import worker, { buildMediathekQuery, handleRequest } from "../index.js";

const SAMPLE_RESULT = {
  result: {
    results: [
      {
        channel: "ARD",
        topic: "tagesschau",
        title: "tagesschau 20:00 Uhr",
        description: "Nachrichten des Tages",
        timestamp: 1780648800,
        duration: 900,
        size: 41943040,
        url_website: "https://www.ardmediathek.de/video/sample",
        url_subtitle: "https://example.com/subtitle.xml",
        url_video: "https://example.com/video-sd.mp4",
        url_video_low: "https://example.com/video-low.mp4",
        url_video_hd: "https://example.com/video-hd.mp4",
        thumbnail: "https://images.example.com/tagesschau.jpg",
        filmlisteTimestamp: 1780658340,
        id: "sample-id",
      },
    ],
    queryInfo: {
      filmlisteTimestamp: 1780658340,
      searchEngineTime: "4.17",
      resultCount: 1,
      totalResults: 42,
      totalRelation: "eq",
      totalEntries: 697433,
    },
  },
  err: null,
};

const FILTER_RESULT = {
  result: {
    results: [
      {
        channel: "NDR",
        topic: "Dokumentation",
        title: "Trailer: Eine Doku kommt bald",
        description: "Nur ein Trailer",
        timestamp: 1780648800,
        duration: 1200,
        url_video: "https://example.com/trailer.mp4",
        url_video_low: "",
        url_video_hd: "",
        id: "trailer-id",
      },
      {
        channel: "SRF",
        topic: "Doku",
        title: "",
        description: "Eintrag ohne Titel",
        timestamp: 1780648800,
        duration: 1800,
        url_video: "https://example.com/empty.mp4",
        url_video_low: "",
        url_video_hd: "",
        id: "empty-id",
      },
      {
        channel: "SRF",
        topic: "Doku",
        title: "Können Hunde sprechen? (mit Untertitel)",
        description: "Untertitel-Version",
        timestamp: 1780648800,
        duration: 1800,
        url_video: "https://example.com/subtitled.mp4",
        url_video_low: "",
        url_video_hd: "",
        id: "subtitle-id",
      },
      {
        channel: "SRF",
        topic: "Doku",
        title: "Wandern ueber die Bergkaemme",
        description: "Eine vollstaendige Doku",
        timestamp: 1780648800,
        duration: 1800,
        url_video: "https://example.com/doku.mp4",
        url_video_low: "",
        url_video_hd: "",
        id: "valid-id",
      },
    ],
    queryInfo: {
      resultCount: 3,
      totalResults: 3,
    },
  },
  err: null,
};

let originalFetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("MSX worker routes", () => {
  it("exports a module worker", async () => {
    assert.equal(typeof worker.fetch, "function");
  });

  it("builds a start object that points to the menu endpoint", async () => {
    const response = await handleRequest(new Request("https://worker.example/msx/start.json"));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.name, "Mediathek Dokus");
    assert.equal(body.parameter, "menu:https://worker.example/msx/menu.json");
    assert.equal(body.style, "flat-separator");
    assert.equal(body.logo, "https://worker.example/assets/logo.svg");
    assert.equal(body.logoSize, "medium");
    assert.equal(body.background, "https://worker.example/assets/background.svg");
    assert.equal(body.transparent, true);
    assert.equal(body.refocus, true);
    assert.equal(body.restore, true);
    assert.equal(body.cache, true);
    assert.equal(body.note, "Media Station X 0.1.166 or higher is recommended.");
  });

  it("serves local start screen assets", async () => {
    const logoResponse = await handleRequest(new Request("https://worker.example/assets/logo.svg"));
    const backgroundResponse = await handleRequest(new Request("https://worker.example/assets/background.svg"));

    assert.equal(logoResponse.status, 200);
    assert.equal(logoResponse.headers.get("Content-Type"), "image/svg+xml; charset=utf-8");
    assert.equal(backgroundResponse.status, 200);
    assert.equal(backgroundResponse.headers.get("Content-Type"), "image/svg+xml; charset=utf-8");
  });

  it("builds a menu with primary navigation entries", async () => {
    const response = await handleRequest(new Request("https://worker.example/msx/menu.json"));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.cache, true);
    assert.equal(body.restore, true);
    assert.equal(body.refocus, true);
    assert.equal(body.style, "flat-separator");
    assert.equal(body.logo, "https://worker.example/assets/logo.svg");
    assert.equal(body.logoSize, "medium");
    assert.equal(body.background, "https://worker.example/assets/background.svg");
    assert.equal(body.transparent, true);
    assert.equal(body.headline, "Mediathek Dokus");
    assert.ok(Array.isArray(body.menu));
    assert.equal(body.menu[0].id, "search");
    assert.match(body.menu[0].data.items[0].action, /^content:request:interaction:/);
    assert.match(body.menu[0].data.items[0].action, /topic(%2C|,)title(%2C|,)description/);
    assert.match(body.menu[0].data.items[0].action, /q=\{INPUT\}\+%3E15/);
    assert.match(body.menu[0].data.items[0].action, /sort=timestamp/);
    assert.match(body.menu[0].data.items[0].action, /order=desc/);
    assert.match(body.menu[0].data.items[0].action, /size=18/);
    assert.match(body.menu[0].data.items[0].action, /Laufzeit wie >15/);
    assert.doesNotMatch(body.menu[0].data.items[0].action, /group=channel/);
    assert.doesNotMatch(body.menu[0].data.items[0].action, /duration_min=15/);
    assert.equal(body.menu.map((item) => item.id).join(","), "search,channels,topics,latest,favorites,history,continue-watching,settings");
    assert.match(body.menu.find((item) => item.id === "latest").data, /sort=timestamp/);
    assert.match(body.menu.find((item) => item.id === "latest").data, /order=desc/);
    assert.match(body.menu.find((item) => item.id === "latest").data, /size=36/);
    assert.match(body.menu.find((item) => item.id === "latest").data, /q=doku\+%3E20/);
    assert.doesNotMatch(body.menu.find((item) => item.id === "latest").data, /group=channel/);
    assert.doesNotMatch(body.menu.find((item) => item.id === "latest").data, /duration_min=20/);
    assert.ok(body.menu.find((item) => item.id === "topics").data.items.length > 0);
    assert.ok(body.menu.find((item) => item.id === "favorites").data.items[0].id === "favorites-placeholder");
    assert.ok(body.menu.find((item) => item.id === "history").data.items[0].id === "history-placeholder");
    assert.ok(body.menu.find((item) => item.id === "continue-watching").data.items[0].id === "continue-watching-placeholder");
  });

  it("queries MediathekViewWeb and maps results to MSX content", async () => {
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://mediathekviewweb.de/api/query");
      assert.equal(init.method, "POST");
      const payload = JSON.parse(init.body);
      assert.deepEqual(payload.queries, [{ fields: ["title", "topic"], query: "tagesschau" }]);
      assert.equal(payload.size, 1);
      assert.equal(payload.duration_min, 900);
      return Response.json(SAMPLE_RESULT);
    };

    const response = await handleRequest(new Request("https://worker.example/msx/search?q=tagesschau&size=1"));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.type, "list");
    assert.equal(body.template.layout, "0,0,4,2");
    assert.equal(body.items[0].title, "tagesschau 20:00 Uhr");
    assert.equal(body.items[0].type, "separate");
    assert.equal(body.items[0].layout, "0,0,4,2");
    assert.equal(body.items[0].action, "execute:https://worker.example/msx/play");
    assert.equal(body.items[0].data.url, "https://example.com/video-hd.mp4");
    assert.equal(body.items[0].titleHeader, "tagesschau");
    assert.equal(body.items[0].titleFooter, "ARD • 15 Min • 05.06.2026");
    assert.equal(body.items[0].badge, "ARD");
    assert.equal(body.items[0].text, "Nachrichten des Tages");
    assert.equal(body.items[0].image, "https://images.example.com/tagesschau.jpg");
    assert.equal(body.items[0].imageFiller, "cover");
    assert.deepEqual(
      body.items[0].options.items.map((item) => item.id),
      [
        "play-default",
        "play-sd",
        "play-low",
        "add-favorite",
        "search-similar",
        "more-from-channel",
        "more-about-topic",
        "open-website",
      ],
    );
    assert.match(
      body.items[0].options.items.find((item) => item.id === "more-from-channel").action,
      /^content:https:\/\/worker\.example\/msx\/search\?channel=ARD/,
    );
    assert.match(
      body.items[0].options.items.find((item) => item.id === "more-about-topic").action,
      /^content:https:\/\/worker\.example\/msx\/search\?topic=tagesschau/,
    );
    assert.equal(body.items.at(-1).id, "new-search");
    assert.match(body.items.at(-1).action, /^content:request:interaction:/);
  });

  it("orders grouped documentary results without visible channel header items", async () => {
    globalThis.fetch = async () => Response.json(SAMPLE_RESULT);

    const response = await handleRequest(
      new Request("https://worker.example/msx/search?q=doku&group=channel&size=1"),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.notEqual(body.items[0].id, "group-ard");
    assert.equal(body.items[0].title, "tagesschau 20:00 Uhr");
    assert.equal(body.items[0].layout, "0,0,4,2");
    assert.equal(body.items[0].titleHeader, "tagesschau");
    assert.equal(body.items[0].titleFooter, "ARD • 15 Min • 05.06.2026");
    assert.equal(body.items[0].badge, "ARD");
    assert.equal(body.items[0].text, "Nachrichten des Tages");
    assert.equal(body.items[0].image, "https://images.example.com/tagesschau.jpg");
    assert.equal(body.items[0].imageFiller, "cover");
  });

  it("filters trailer, subtitle-variant, and missing-title results", async () => {
    globalThis.fetch = async () => Response.json(FILTER_RESULT);

    const response = await handleRequest(new Request("https://worker.example/msx/search?q=doku&group=channel&size=3"));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(
      body.items.filter((item) => item.type === "separate").map((item) => item.title),
      ["Wandern ueber die Bergkaemme"],
    );
  });

  it("returns a content action for MSX execute:code searches", async () => {
    const response = await handleRequest(
      new Request("https://worker.example/msx/search-action", {
        method: "POST",
        body: JSON.stringify({ code: "tatort" }),
      }),
    );
    const body = await response.json();

    assert.equal(body.response.status, 200);
    assert.match(body.response.data.action, /^content:https:\/\/worker\.example\/msx\/search\?q=tatort\+%3E15/);
    assert.doesNotMatch(body.response.data.action, /duration_min/);
  });

  it("returns a video action for MSX play actions", async () => {
    const response = await handleRequest(
      new Request("https://worker.example/msx/play", {
        method: "POST",
        body: JSON.stringify({
          data: {
            title: "Film",
            urls: {
              hd: "https://example.com/hd.mp4",
              sd: "https://example.com/sd.mp4",
            },
          },
        }),
      }),
    );
    const body = await response.json();

    assert.equal(body.response.status, 200);
    assert.equal(body.response.data.action, "video:https://example.com/hd.mp4");
    assert.equal(body.response.data.data.playerLabel, "Film");
  });

  it("returns an MSX resolve response", async () => {
    const response = await handleRequest(
      new Request("https://worker.example/msx/resolve?url=https%3A%2F%2Fexample.com%2Fmovie.mp4&label=Movie"),
    );
    const body = await response.json();

    assert.equal(body.response.status, 200);
    assert.equal(body.response.data.url, "https://example.com/movie.mp4");
    assert.equal(body.response.data.label, "Movie");
  });

  it("handles CORS preflight", async () => {
    const response = await handleRequest(new Request("https://worker.example/msx/menu.json", { method: "OPTIONS" }));

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
  });

  it("filters query proxy scannedPages to stream pages only", async () => {
    globalThis.fetch = async () =>
      Response.json({
        result: {
          scannedPages: [
            "https://www.fernsehserien.de/weltspiegel/streams",
            "https://www.fernsehserien.de/ajax streams-entkuerzen",
            "https://www.fernsehserien.de/ajax jetzt-ansehen",
            "https://www.fernsehserien.de/alpha/streams/",
            "/streams?debug=1",
          ],
          nested: {
            scannedPages: [
              "https://www.fernsehserien.de/weltspiegel/episoden",
              "https://www.fernsehserien.de/weltspiegel/streams?staffel=1",
            ],
          },
        },
        err: null,
      });

    const response = await handleRequest(new Request("https://worker.example/api/query?q=doku"));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.result.scannedPages, [
      "https://www.fernsehserien.de/weltspiegel/streams",
      "https://www.fernsehserien.de/alpha/streams/",
      "/streams?debug=1",
    ]);
    assert.deepEqual(body.result.nested.scannedPages, [
      "https://www.fernsehserien.de/weltspiegel/streams?staffel=1",
    ]);
  });
});

describe("Mediathek query builder", () => {
  it("parses compact MediathekViewWeb-like syntax", () => {
    const query = buildMediathekQuery(new URLSearchParams("q=!ARD #Tatort >80&size=99"));

    assert.deepEqual(query.queries, [
      { fields: ["channel"], query: "ARD" },
      { fields: ["topic"], query: "Tatort" },
    ]);
    assert.equal(query.duration_min, 4800);
    assert.equal(query.size, 36);
  });

  it("parses runtime filters directly from the search query", () => {
    const query = buildMediathekQuery(new URLSearchParams("q=doku >20&size=9"));

    assert.deepEqual(query.queries, [{ fields: ["title", "topic"], query: "doku" }]);
    assert.equal(query.duration_min, 1200);
    assert.equal(query.size, 9);
  });

  it("keeps the strongest minimum runtime if a default is appended", () => {
    const query = buildMediathekQuery(new URLSearchParams("q=doku >20 >15"));

    assert.equal(query.duration_min, 1200);
  });

  it("accepts MSX input plugin parameters", () => {
    const query = buildMediathekQuery(new URLSearchParams("input=natur&limit=12"));

    assert.deepEqual(query.queries, [{ fields: ["title", "topic"], query: "natur" }]);
    assert.equal(query.size, 12);
    assert.equal(query.duration_min, 900);
  });

  it("keeps explicit duration filters over the default", () => {
    const query = buildMediathekQuery(new URLSearchParams("q=doku&duration_min=30"));

    assert.equal(query.duration_min, 1800);
  });
});
