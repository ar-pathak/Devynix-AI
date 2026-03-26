// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api'; 

export const analyzeCode = async (code, language) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // UPDATE: Ab yeh real error detail throw karega UI par
      throw new Error(errorData.details || errorData.error || 'Failed to analyze code');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Connection Error:", error);
    throw error;
  }
};