import axios from 'axios';

export function getFeeds(config) {
    return config.feeds || [];
}

export async function fetchAllFeeds(feeds) {
    const results = [];
    for (const feed of feeds) {
        try {
            const content = await fetchFeed(feed.url);
            results.push({
                name: feed.name,
                url: feed.url,
                content
            });
        } catch (error) {
            results.push({
                name: feed.name,
                url: feed.url,
                error: error.message
            });
        }
    }
    return results;
}

export async function fetchFeed(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Network error: No response received');
        } else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
}

export function parseFeed(feed) {
    // Parse XML items to extract title and link (supports both RSS and Atom)

        if (feed.error) return feed;

        console.log(`\n=== Debug: ${feed.name} ===`);
        console.log(`Content length: ${feed.content.length}`);
        console.log(`First 200 chars: ${feed.content.substring(0, 200)}...`);

        // Try RSS format first (<item> tags)
        let items = feed.content.match(/<item>[\s\S]*?<\/item>/g) || [];
        let format = 'RSS';

        // If no RSS items found, try Atom format (<entry> tags)
        if (items.length === 0) {
            items = feed.content.match(/<entry>[\s\S]*?<\/entry>/g) || [];
            format = 'Atom';
        }

        console.log(`Found ${items.length} items (${format} format)`);

        const parsedItems = items.map(item => {
            let titleMatch, linkMatch;

            if (format === 'RSS') {
                titleMatch = item.match(/<title>(.*?)<\/title>/);
                linkMatch = item.match(/<link>(.*?)<\/link>/);
            } else {
                // Atom format
                titleMatch = item.match(/<title[^>]*>(.*?)<\/title>/);
                linkMatch = item.match(/<link[^>]*href="([^"]*)"[^>]*>/);
            }

            return {
                title: titleMatch ? titleMatch[1] : '',
                link: linkMatch ? linkMatch[1] : ''
            };
        });

        const content = parsedItems.map(item => `${item.title}\n${item.link}`).join('\n\n');
        console.log(`Parsed content length: ${content.length}`);

        return {
            ...feed,
            content: content
        };
}