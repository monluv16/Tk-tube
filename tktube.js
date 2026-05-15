function getManifest() {
    return JSON.stringify({
        "id": "tktube",
        "name": "TKTube - JAV HD",
        "version": "1.0.7",
        "baseUrl": "https://tktube.com",
        "iconUrl": "https://tktube.com/static/images/logo.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "MOVIE",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([{ slug: 'latest-updates', title: '🔥 New Videos', type: 'Horizontal' }]);
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
    var items = [];
    var regex = /<a[^>]*href="\/([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?>([^<]+)[\s\S]*?([\d:]+)?/gi;
    var match;
    while ((match = regex.exec(html)) !== null) {
        var slug = match[1], title = match[3].trim();
        if (slug && title && !slug.includes('categories')) {
            items.push({
                id: slug,
                title: title,
                posterUrl: match[2].startsWith('http') ? match[2] : 'https://tktube.com' + match[2],
                quality: "FHD"
            });
        }
    }
    return JSON.stringify({ items: items, pagination: { currentPage: 1, totalPages: 10 } });
}

function parseSearchResponse(html) { return parseListResponse(html); }

function parseMovieDetail(html) {
    return JSON.stringify({
        title: "TKTube Video",
        servers: [{ name: "Server 1", episodes: [{ id: "play", name: "Play", slug: "play" }] }]
    });
}

function parseDetailResponse(html) {
    var m3u8 = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    if (m3u8) {
        return JSON.stringify({ url: m3u8[1], headers: { "Referer": "https://tktube.com/" } });
    }
    return JSON.stringify({ url: "https://tktube.com", isEmbed: true });
}

function parseEmbedResponse(html) {
    var m3u8 = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/i);
    return JSON.stringify(m3u8 ? { url: m3u8[1] } : { url: "" });
}

// Các hàm thừa
function getPrimaryCategories() { return "[]"; }
function getFilterConfig() { return "{}"; }
function getUrlCategories() { return ""; }
function parseCategoriesResponse() { return "[]"; }
