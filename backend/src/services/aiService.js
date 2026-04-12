/**
 * AI Service for generating AI responses
 * This service handles AI-powered conversation features
 */

class AIService {
  constructor() {
    this.responsePatterns = new Map();
    this.initializePatterns();
  }

  // Initialize response patterns for AI responses
  initializePatterns() {
    this.responsePatterns.set(/^(hi|hello|hey|greetings)/i, [
      "Hello! How can I help you today?",
      "Hi there! What's on your mind?",
      "Hey! Great to chat with you!",
      "Hello! Always happy to talk!",
    ]);
    this.responsePatterns.set(/^(how|what|when|where|why|who)\s/i, [
      "That's a great question! Let me think about that.",
      "Interesting! Here's what I think about that...",
      "Good question! I'd say...",
      "That's something I've thought about before.",
    ]);
    this.responsePatterns.set(/(thanks|thank you|appreciate|thankyou)/i, [
      "You're welcome! Always happy to help.",
      "My pleasure! Glad I could assist.",
      "Anytime! That's what I'm here for.",
      "Happy to help! Feel free to ask anything else.",
    ]);
    this.responsePatterns.set(/(bye|goodbye|see you|farewell|take care)/i, [
      "Goodbye! Talk to you later!",
      "See you soon! Have a great day!",
      "Take care! Looking forward to chatting again!",
      "Bye! Hope to talk with you again soon!",
    ]);
    this.responsePatterns.set(/(yes|yeah|sure|okay|ok|agreed|sounds good)/i, [
      "Great! Let's go with that then.",
      "Awesome! I'm on the same page.",
      "Perfect! I'm glad we agree on this.",
      "Excellent! We're on the same wavelength.",
    ]);
    this.responsePatterns.set(/(no|nope|disagree|don't think so|not really)/i, [
      "I understand your perspective. Let's see if we can find common ground.",
      "Interesting. What would you prefer instead?",
      "I see what you mean. Tell me more about your thoughts.",
      "Fair point. Let me reconsider that.",
    ]);
    this.responsePatterns.set(/(haha|hehe|lol|funny|joke|laughter)/i, [
      "I'm glad that made you laugh! 😄",
      "Humor is the best medicine! 😊",
      "That's hilarious! Made my day brighter.",
      "You've got a great sense of humor!",
    ]);
    this.responsePatterns.set(/(help|assist|support|can you help|need help)/i, [
      "Absolutely! I'm here to help. What do you need?",
      "Of course! Tell me what's going on.",
      "I'd be happy to help! What's the issue?",
      "Sure thing! How can I assist you?",
    ]);
    this.responsePatterns.set(/(tell|explain|describe|talk about)/i, [
      "That's an interesting topic! Here's my take on it...",
      "Let me share my thoughts on that...",
      "That's worth discussing. From my perspective...",
      "Good topic! I have some insights on that.",
    ]);
  }

  // Generate AI response based on user message
  async generateResponse(options) {
    try {
      const { userMessage } = options;
      const normalizedMessage = userMessage.trim().toLowerCase();
      const response = this.matchPattern(normalizedMessage);

      if (response) {
        return {
          response,
          confidence: 0.85,
          metadata: {
            timestamp: new Date(),
            model: "pattern-matcher-v1",
          },
        };
      }

      // Fallback to contextual response
      return this.generateContextualResponse(normalizedMessage);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return this.getFallbackResponse();
    }
  }

  // Match user message against predefined patterns
  matchPattern(message) {
    for (const [pattern, responses] of this.responsePatterns.entries()) {
      if (pattern.test(message)) {
        return this.selectRandomResponse(responses);
      }
    }
    return null;
  }

  // Generate contextual response based on message content
  generateContextualResponse(message) {
    const wordCount = message.split(" ").length;
    const hasNumbers = /\d+/.test(message);
    const hasQuestion = message.includes("?");

    let response = "";

    if (hasQuestion) {
      response = this.generateQuestionResponse(message);
    } else if (hasNumbers) {
      response = this.generateNumberResponse(message);
    } else if (wordCount > 30) {
      response = this.generateDetailedResponse(message);
    } else {
      response = this.generateSimpleResponse(message);
    }

    return {
      response,
      confidence: 0.7,
      metadata: {
        timestamp: new Date(),
        model: "contextual-v1",
      },
    };
  }

  // Generate response to a question
  generateQuestionResponse(message) {
    const responses = [
      `That's a thoughtful question about "${this.extractKeywords(message)}". Let me share my perspective...`,
      `Great question! Regarding "${this.extractKeywords(message)}", I believe...`,
      `Interesting inquiry! When it comes to "${this.extractKeywords(message)}", I'd say...`,
      `That's something worth exploring. About "${this.extractKeywords(message)}", my thoughts are...`,
    ];
    return this.selectRandomResponse(responses);
  }

  // Generate response containing numbers
  generateNumberResponse(message) {
    const numbers = message.match(/\d+/g);
    const responses = [
      `Those are interesting numbers! With ${numbers?.[0]} in mind, I think...`,
      `The numbers you mentioned are significant. Regarding that ${numbers?.[0]}...`,
      `I appreciate the specifics. With ${numbers?.[0]} as a factor, I'd consider...`,
    ];
    return this.selectRandomResponse(responses);
  }

  // Generate response for detailed message
  generateDetailedResponse(message) {
    const responses = [
      `That's quite detailed! Let me break down my thoughts on this...`,
      `I appreciate the thorough explanation. Here's my analysis...`,
      `You've provided good context. With all that in mind, I think...`,
      `That's comprehensive! My response to all that is...`,
    ];
    return this.selectRandomResponse(responses);
  }

  // Generate simple response
  generateSimpleResponse(message) {
    const keyword = this.extractKeywords(message);
    const responses = [
      `Understood! So you're talking about ${keyword}. I think...`,
      `Got it! Regarding ${keyword}, I'd say...`,
      `I see! When it comes to ${keyword}, my view is...`,
      `Makes sense! About ${keyword}, here's what I think...`,
    ];
    return this.selectRandomResponse(responses);
  }

  // Extract keywords from message
  extractKeywords(message) {
    const words = message.split(" ");
    const commonWords = [
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "is", "are", "was", "were",
    ];
    const keyword = words.find((w) => !commonWords.includes(w.toLowerCase()));
    return keyword || "that";
  }

  // Select random response from array
  selectRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get fallback response when error occurs
  getFallbackResponse() {
    const fallbacks = [
      "I appreciate your message! Let me think about that for a moment...",
      "That's interesting! I'm processing your thoughts...",
      "I understand! Here's my perspective on that...",
      "Thanks for sharing! I have some thoughts on that...",
    ];

    return {
      response: this.selectRandomResponse(fallbacks),
      confidence: 0.5,
      metadata: {
        timestamp: new Date(),
        model: "fallback-v1",
      },
    };
  }

  // Generate contextual response based on conversation history
  async generateContextualAIResponse(userMessage, conversationHistory = []) {
    try {
      const context = conversationHistory.slice(-3).join(" ");
      const fullContext = `${context} ${userMessage}`;

      const response = await this.generateResponse({
        userMessage: fullContext,
        conversationHistory,
      });

      return response;
    } catch (error) {
      console.error("Error generating contextual response:", error);
      return this.getFallbackResponse();
    }
  }

  // Detect sentiment of message (basic implementation)
  detectSentiment(message) {
    const positiveWords = /(good|great|awesome|excellent|happy|love|thanks|thank you|wonderful|amazing)/i;
    const negativeWords = /(bad|terrible|awful|hate|angry|sad|upset|disappointing|worst)/i;

    if (positiveWords.test(message)) return "positive";
    if (negativeWords.test(message)) return "negative";
    return "neutral";
  }

  // Check if message requires escalation to human
  shouldEscalateToHuman(message) {
    const escalationPatterns = [
      /urgent/i,
      /emergency/i,
      /crisis/i,
      /serious/i,
      /help me/i,
      /stuck/i,
    ];

    return escalationPatterns.some((pattern) => pattern.test(message));
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export class for testing
export default AIService;