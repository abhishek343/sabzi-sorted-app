export default async (req, context) => {
    // 1. Get the prompt from the user's request
    const body = await req.json();
    const userPrompt = body.prompt;

    // 2. Get the Secret Key from Netlify's Vault
    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Call Google Gemini (Server to Server)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }]
        })
    });

    const data = await response.json();

    // 4. Send the answer back to the frontend
    return new Response(JSON.stringify(data));
};
