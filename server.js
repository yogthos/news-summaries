import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { marked } from 'marked';
import { main } from './src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory (for React build)
app.use(express.static(join(__dirname, 'public')));

// API endpoint to get analysis data
app.get('/api/analysis', async (req, res) => {
    try {
        // Run the analysis and get the result
        const result = await main();

        // Parse the analysis text to extract structured data
        const parsedAnalysis = parseAnalysisOutput(result.analysis);

        res.json({
            stats: result.stats,
            analysis: parsedAnalysis,
            rawData: {
                feeds: result.feeds,
                analysis: result.analysis
            }
        });
    } catch (error) {
        console.error('Error in analysis API:', error);
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
});

function parseAnalysisOutput(analysisText) {
    // Parse the deepseek analysis
    if (!analysisText) {
        return {
            categories: {},
            summary: 'Analysis not available',
            html: '<p>Analysis not available</p>'
        };
    }

    // Remove the "Getting recommendations from Deepseek" line if present
    const cleanText = analysisText.replace(/Getting recommendations from Deepseek\n?/, '').trim();

    // Convert markdown to HTML
    const html = marked(cleanText);

    // Extract categories and articles using regex for structured data
    const categories = {};
    const categoryMatches = cleanText.match(/### \*\*(.*?)\*\*/g);

    if (categoryMatches) {
        categoryMatches.forEach(match => {
            const categoryName = match.replace(/### \*\*|\*\*/g, '');
            const categoryStart = cleanText.indexOf(match);
            const nextCategory = cleanText.indexOf('### **', categoryStart + 1);
            const categoryEnd = nextCategory !== -1 ? nextCategory : cleanText.length;
            const categoryContent = cleanText.substring(categoryStart, categoryEnd);

            // Extract articles from this category
            const articleMatches = categoryContent.match(/\*\*(.*?)\*\*\s*\n\s*\[Link\]\((.*?)\)/g);
            if (articleMatches) {
                categories[categoryName] = articleMatches.map(articleMatch => {
                    const titleMatch = articleMatch.match(/\*\*(.*?)\*\*/);
                    const linkMatch = articleMatch.match(/\[Link\]\((.*?)\)/);
                    return {
                        title: titleMatch ? titleMatch[1] : '',
                        link: linkMatch ? linkMatch[1] : '',
                        description: ''
                    };
                });
            }
        });
    }

    // Extract summary
    const summaryMatch = cleanText.match(/### \*\*Key Takeaways:\*\*([\s\S]*?)(?=###|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    return {
        categories,
        summary,
        html
    };
}

// Serve the main page (React app)
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(join(__dirname, 'public', 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});