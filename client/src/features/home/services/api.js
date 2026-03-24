// src/services/api.js

export const analyzeCode = async (code, language) => {
  // Simulate network delay for 2 seconds to test the awesome loader
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        explanation: `This ${language} code defines a function that handles asynchronous operations. It follows standard practices for fetching and processing data.`,
        bugs: [
          "No error handling for edge cases (e.g., if user_id is null).",
          "Potential memory leak if the promise doesn't resolve in certain environments."
        ],
        improvements: [
          "Add strict type checking for the parameters.",
          "Implement a retry mechanism for failed network requests.",
          "Extract the API URL into a configuration file or environment variable."
        ]
      });
    }, 2000);
  });
};