import axios from 'axios';

export default async function findInterestingArticles(aiConfig, content) {
    console.log('Getting recommendations from Deepseek');
    // Check if API key is set
    if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }

    // Call Deepseek API for book recommendations
    const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
            model: aiConfig.model || "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: aiConfig.systemPrompt || "You're a helpful assistant who can analyze news articles and find the most important ones. You will be given a list of news articles and you will need to find the most relevant ones. You will need to return a list of the most important articles."
                },
                {
                    role: "user",
                    content: `${aiConfig.userPrompt || "Find articles focusing on geopolitics and economics, list the article titles and links, and write a short summary of how the articles relate to each other, and the general geopolitical situation"}\n\n${content}`
                }
            ],
            temperature: aiConfig.temperature || 0.3
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
}