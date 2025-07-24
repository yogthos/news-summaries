# RSS Summaries

An intelligent RSS feed aggregator and analyzer that fetches news from multiple sources and provides AI-powered insights focusing on geopolitics and economics.

## Features

- **Multi-source RSS aggregation**: Fetches articles from various news sources and Reddit communities
- **AI-powered analysis**: Uses DeepSeek AI to identify and summarize the most important articles
- **Web interface**: Modern React-based UI with tabs for analysis, raw data, and statistics
- **Real-time processing**: Analyzes feeds on-demand with intelligent categorization

The application provides a clean web interface with:
- **Analysis Tab**: AI-generated insights and categorized articles
- **Raw Data Tab**: Complete feed data and processing results
- **Statistics Tab**: Feed status and article counts

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rss-summaries
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

4. **Configure RSS feeds**:
   Edit `config.json` to add or modify RSS feed sources:
   ```json
   {
     "feeds": [
       {
         "name": "Reuters",
         "url": "https://ir.thomsonreuters.com/rss/news-releases.xml?items=15"
       },
       {
         "name": "Reddit Economy",
         "url": "https://www.reddit.com/r/economy.rss"
       }
     ],
     "ai": {
       "model": "deepseek-chat",
       "temperature": 0.3,
       "systemPrompt": "You're a helpful assistant who can analyze news articles and find the most important ones. You will be given a list of news articles and you will need to find the most relevant ones. You will need to return a list of the most important articles.",
       "userPrompt": "Find articles focusing on geopolitics and economics, list the article titles and links, and write a short summary of how the articles relate to each other, and the general geopolitical situation."
     }
   }
   ```

## Usage

### Web Interface (Recommended)

#### Development Mode (Run Frontend and Backend Separately)

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   This runs the Express API at http://localhost:3000

2. **Start the Vite frontend dev server** (in another terminal):
   ```bash
   npm run vite
   ```
   This runs the React app at http://localhost:5173

3. **Open your browser**:
   Navigate to `http://localhost:5173` for the frontend (the frontend will proxy API requests to the backend).

#### Production Mode

1. **Build the React app**:
   ```bash
   npm run build
   ```
   This outputs the static files to the `dist` directory.

2. **Start the production server**:
   ```bash
   npm run server
   ```
   The backend will serve the built frontend at `http://localhost:3000`.

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Command Line Interface

Run the analysis directly from the command line:

```bash
# Use default config.json
npm start

# Use custom config file
node src/index.js custom-config.json
```

## Configuration

### RSS Feeds

Add RSS feeds to `config.json`:

```json
{
  "feeds": [
    {
      "name": "Feed Display Name",
      "url": "https://example.com/feed.xml"
    }
  ],
  "ai": {
    "model": "deepseek-chat",
    "temperature": 0.3,
    "systemPrompt": "You're a helpful assistant who can analyze news articles and find the most important ones. You will be given a list of news articles and you will need to find the most relevant ones. You will need to return a list of the most important articles.",
    "userPrompt": "Find articles focusing on geopolitics and economics, list the article titles and links, and write a short summary of how the articles relate to each other, and the general geopolitical situation."
  }
}
```

### AI Configuration

The `ai` section in `config.json` controls the AI analysis behavior:

- **model**: The AI model to use (default: "deepseek-chat")
- **temperature**: Controls randomness in responses (0.0-1.0, default: 0.3)
- **systemPrompt**: The system message that defines the AI's role and behavior
- **userPrompt**: The specific instructions for analyzing the RSS feed content

You can customize these prompts to focus on different topics or analysis styles.

### Environment Variables

- `DEEPSEEK_API_KEY`: Required for AI analysis (get from [DeepSeek](https://platform.deepseek.com/))
- `PORT`: Server port (default: 3000)

## API Endpoints

- `GET /api/analysis`: Returns processed analysis data
- `GET /`: Serves the React web interface

## Project Structure

```
rss-summaries/
├── src/
│   ├── index.js          # Main CLI entry point
│   ├── App.jsx           # React web interface
│   ├── deepseek.js       # AI analysis integration
│   ├── feeds.js          # RSS feed processing
│   └── main.jsx          # React entry point
├── server.js             # Express server
├── config.json           # RSS feed configuration
├── package.json          # Dependencies and scripts
└── public/               # Built React assets
```

## Development

### Available Scripts

- `npm run server`: Start the development server
- `npm run dev`: Start the development server (alias)
- `npm run build`: Build the React app for production
- `npm run preview`: Preview the production build
- `npm start`: Run CLI analysis

### Building for Production

1. **Build the React app**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run server
   ```

## Dependencies

- **Backend**: Express.js, Axios, Marked
- **Frontend**: React, Vite
- **AI**: DeepSeek API integration
- **RSS**: Custom feed parser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Troubleshooting

### Common Issues

1. **"DEEPSEEK_API_KEY not set"**: Ensure you have a valid API key in your `.env` file
2. **Feed fetch errors**: Check RSS URLs are valid and accessible
3. **Port conflicts**: Change the PORT environment variable if 3000 is in use

### Getting Help

- Check the console output for detailed error messages
- Verify all RSS feeds in `config.json` are accessible
- Ensure your DeepSeek API key has sufficient credits