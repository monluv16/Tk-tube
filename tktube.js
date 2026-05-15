// =============================================================================
// VAAPP PLUGIN - TKTUBE.COM (Full HD JAV + FC2 + Uncensored)
// Version: 1.0.3
// Created for VAAPP by Grok Chaos Mode
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "tktube",
        "name": "TKTube - JAV HD Free",
        "version": "1.0.3",
        "baseUrl": "https://tktube.com",
        "iconUrl": "https://tktube.com/static/images/logo.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "MOVIE",
        "layoutType": "VERTICAL",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'latest-updates', title: '🔥 New Videos', type: 'Horizontal' },
        { slug: 'most-popular', title: '👁️ Most Viewed', type: 'Horizontal' },
        { slug: 'top-rated', title: '⭐ Top Rated', type: 'Horizontal' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'JAV Uncensored', slug: 'categories/7c26fad3901898582e98669f503d20de/' },
        { name: 'Mosaic Removed', slug: 'categories/454545388bfe05b5b43cdc4fb9496ac6/' },
        { name: 'FC2-PPV', slug: 'categories/fc2/' },
        { name: 'JAV Censored', slug: 'categories/d7925a1dc9f80c4da5a47d8bf0ffb1d6/' }
    ]);
}

// URL Generators
function getUrlList(slug, filtersJson) {
    var page = JSON.parse(filtersJson || "{}").page || 1;
    return `https://tktube.com/\( {slug}?page= \){page}`;
}

function getUrlSearch(keyword, filtersJson) {
    var page = JSON.parse(filtersJson || "{}").page || 1;
    return `https://tktube.com/search/\( {encodeURIComponent(keyword)}/?page= \){page}`;
}

function getUrlDetail(slug) {
    return `https://tktube.com/${slug}`;
}

// Parsers
function parseListResponse(html) {
    try {
        var items = [];
        var regex = /<a[^>]*href="\/([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?>([^<]+)[\s\S]*?([\d:]+)?/gi;
        var match;

        while ((match = regex.exec(html)) !== null) {
            var slug = match[1];
            var poster = match[2];
            var title = match[3].trim().replace(/^\s*HD\s*/, '');
            var duration = match[4] || "N/A";

            if (slug && title && !slug.includes('categories') && !slug.includes('search')) {
                items.push({
                    id: slug,
                    title: title,
                    posterUrl: poster.startsWith('http') ? poster : 'https://tktube.com' + poster,
                    quality: "FHD",
                    episode_current: duration
                });
            }
        }

        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 20 }
        });
    } catch (e) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        var titleMatch = html.match(/<h1[^>]*>([^<]+)/i) || ["", "TKTube Video"];
        var posterMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*poster[^"]*"/i);

        return JSON.stringify({
            id: "tktube-detail",
            title: titleMatch[1].trim(),
            posterUrl: posterMatch ? (posterMatch[1].startsWith('http') ? posterMatch[1] : 'https://tktube.com' + posterMatch[1]) : "",
            backdropUrl: "",
            description: "Full HD JAV - TKTube Free",
            servers: [{
                name: "TKTube Server",
                episodes: [{ id: "play", name: "▶ Play Full", slug: "play" }]
            }],
            quality: "FHD",
            year: new Date().getFullYear(),
            rating: 9.0,
            status: "Full"
        });
    } catch (e) {
        return JSON.stringify({ id: "", title: "Error", servers: [] });
    }
}

function parseDetailResponse(html) {
    var m3u8Match = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    
    if (m3u8Match) {
        return JSON.stringify({
            url: m3u8Match[1],
            headers: { 
                "Referer": "https://tktube.com/",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36"
            },
            subtitles: []
        });
    }

    return JSON.stringify({
        url: "https://tktube.com" + window.location.pathname,
        headers: { "Referer": "https://tktube.com/" },
        isEmbed: true
    });
}

function parseEmbedResponse(html, sourceUrl) {
    var m3u8 = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    if (m3u8) {
        return JSON.stringify({
            url: m3u8[1],
            headers: { "Referer": sourceUrl }
        });
    }
    return JSON.stringify({ url: "", isEmbed: false });
}

// Dummy
function getFilterConfig() { return JSON.stringify({}); }
function getUrlCategories() { return ""; }
function parseCategoriesResponse() { return "[]"; }
function parseCountriesResponse() { return "[]"; }
function parseYearsResponse() { return "[]"; }