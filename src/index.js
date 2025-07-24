import fs from 'fs';
import findInterestingArticles from './deepseek.js';
import { parseFeed, fetchFeed, getFeeds, fetchAllFeeds } from './feeds.js';

async function main() {
    // Get config file name from command line arguments
    const args = process.argv.slice(2);
    const configFile = args[0] || 'config.json';

    try {
        // Read and parse config file
        const configData = fs.readFileSync(configFile, 'utf8');
        const config = JSON.parse(configData);

        // Get feeds from config
        const feeds = getFeeds(config);

        if (feeds.length === 0) {
            console.log('No feeds found in config file');
            return;
        }

        console.log(`Found ${feeds.length} feed(s) in ${configFile}\n`);

        const results = await fetchAllFeeds(feeds);

        const parsedResults = results.map(parseFeed);


        // Show feed status and aggregate content
        const successfulFeeds = parsedResults.filter(r => !r.error);
        const failedFeeds = parsedResults.filter(r => r.error);

        console.log(`\n=== Feed Status ===`);
        console.log(`Successful: ${successfulFeeds.length}/${parsedResults.length}`);
        console.log(`Failed: ${failedFeeds.length}/${parsedResults.length}\n`);

        if (failedFeeds.length > 0) {
            console.log(`=== Failed Feeds ===`);
            failedFeeds.forEach(feed => {
                console.log(`${feed.name}: ${feed.error}`);
            });
            console.log('');
        }

        const interestingArticles = await findInterestingArticles(
            config.ai || {},
            parsedResults.map(r => r.content).join('\n\n')
        );
        console.log(interestingArticles);

        return {
            feeds: parsedResults,
            analysis: interestingArticles,
            stats: {
                totalFeeds: parsedResults.length,
                successfulFeeds: successfulFeeds.length,
                failedFeeds: failedFeeds.length,
                totalArticles: parsedResults.reduce((sum, feed) => {
                    if (!feed.error && feed.content) {
                        const items = feed.content.split('\n\n').filter(item => item.trim());
                        return sum + items.length;
                    }
                    return sum;
                }, 0)
            }
        };

    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Usage: node src/index.js [config-file]');
        process.exit(1);
    }
}

// Run main function if this file is executed directly
//main();

export { main };