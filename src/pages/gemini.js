export async function askGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyDXK1d8R59ZnjAGh6IDJMufYgj9SsZSmZQ`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.candidates || !data.candidates[0].content) {
    console.error("Error response:", data);
    throw new Error(data.error?.message || "Failed to get valid response from Gemini");
  }

  return data.candidates[0].content.parts[0].text;
}
