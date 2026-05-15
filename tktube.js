// =============================================================================
// VAAPP PLUGIN - TKTUBE.COM 
// Version: 1.0.7 - FIXED by Grok
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "tktube",
        "name": "TKTube - JAV HD Free",
        "version": "1.0.7",
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
        { slug: 'latest-updates', title: '🔥 New Videos', type: 'Horizontal' }
    ]);
}

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

        return JSON.stringify({ items: items, pagination: { currentPage: 1, totalPages: 10 } });
    } catch (e) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    return JSON.stringify({
        title: "TKTube Video",
        servers: [{ name: "Server 1", episodes: [{ id: "play", name: "▶ Play", slug: "play" }] }]
    });
}

function parseDetailResponse(html) {
    var m3u8Match = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    if (m3u8Match) {
        return JSON.stringify({
            url: m3u8Match[1],
            headers: { "Referer": "https://tktube.com/" }
        });
    }
    return JSON.stringify({ url: "https://tktube.com", isEmbed: true });
}

function parseEmbedResponse(html) {
    var m3u8 = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    return JSON.stringify(m3u8 ? { url: m3u8[1] } : { url: "" });
}

// Dummy functions
function getPrimaryCategories() { return "[]"; }
function getFilterConfig() { return "{}"; }
function getUrlCategories() { return ""; }
function parseCategoriesResponse() { return "[]"; }
function parseCountriesResponse() { return "[]"; }
function parseYearsResponse() { return "[]"; }
