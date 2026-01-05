import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Keywords that indicate F1-related queries
const F1_KEYWORDS = [
  'f1', 'formula 1', 'formula one', 'grand prix', 'gp',
  'verstappen', 'hamilton', 'leclerc', 'norris', 'sainz', 'perez', 'alonso', 'russell',
  'red bull', 'mercedes', 'ferrari', 'mclaren', 'aston martin', 'alpine', 'williams',
  'qualifying', 'race', 'championship', 'standings', 'points', 'pole position',
  'fastest lap', 'pit stop', 'driver', 'constructor', 'season'
];

// Time-sensitive keywords that suggest need for live data
const TIME_SENSITIVE_KEYWORDS = [
  'current', 'latest', 'recent', 'now', 'today', 'this season', 'this year',
  '2024', '2025', '2026', 'standings', 'points', 'championship', 'last race',
  'next race', 'upcoming', 'schedule', 'results', 'winner', 'won'
];

function isTimeSensitiveF1Query(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const hasF1Keyword = F1_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  const hasTimeSensitive = TIME_SENSITIVE_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  
  // Check for year mentions 2024 or later
  const yearMatch = lowerMessage.match(/20(2[4-9]|[3-9]\d)/);
  const hasRecentYear = yearMatch !== null;
  
  return hasF1Keyword && (hasTimeSensitive || hasRecentYear);
}

async function searchSerpAPI(query: string): Promise<string> {
  const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');
  
  if (!SERPAPI_KEY) {
    console.error('SERPAPI_API_KEY not configured');
    return '';
  }

  try {
    const searchQuery = `Formula 1 ${query} 2024 2025`;
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&api_key=${SERPAPI_KEY}&num=5`;
    
    console.log('Fetching live F1 data from SerpAPI...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('SerpAPI error:', response.status);
      return '';
    }

    const data = await response.json();
    
    // Extract relevant information from search results
    let context = '';
    
    // Get organic results
    if (data.organic_results && data.organic_results.length > 0) {
      const results = data.organic_results.slice(0, 3);
      context += 'Live search results:\n';
      results.forEach((result: any, index: number) => {
        context += `${index + 1}. ${result.title}\n`;
        if (result.snippet) {
          context += `   ${result.snippet}\n`;
        }
      });
    }

    // Get answer box if available
    if (data.answer_box) {
      if (data.answer_box.answer) {
        context += `\nDirect answer: ${data.answer_box.answer}\n`;
      }
      if (data.answer_box.snippet) {
        context += `Info: ${data.answer_box.snippet}\n`;
      }
    }

    // Get sports results if available (for standings, race results)
    if (data.sports_results) {
      context += `\nSports data: ${JSON.stringify(data.sports_results)}\n`;
    }

    // Get knowledge graph if available
    if (data.knowledge_graph && data.knowledge_graph.description) {
      context += `\nBackground: ${data.knowledge_graph.description}\n`;
    }

    console.log('Retrieved live context:', context.substring(0, 200) + '...');
    return context;
  } catch (error) {
    console.error('Error fetching from SerpAPI:', error);
    return '';
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LYSR_API_KEY = Deno.env.get('LYSR_API_KEY');
    
    if (!LYSR_API_KEY) {
      console.error('LYSR_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let augmentedMessage = message;
    
    // Check if query is time-sensitive F1 related
    if (isTimeSensitiveF1Query(message)) {
      console.log('Detected time-sensitive F1 query, fetching live data...');
      
      const liveContext = await searchSerpAPI(message);
      
      if (liveContext) {
        augmentedMessage = `[LIVE DATA CONTEXT - Use this verified information for your response about recent F1 events (2024 season onwards):]
${liveContext}

[USER QUESTION:]
${message}

[IMPORTANT: Base your response on the live data provided above. If the live data doesn't contain the specific information needed, acknowledge that you don't have verified current data rather than guessing.]`;
      } else {
        // No live data available, add disclaimer instruction
        augmentedMessage = `${message}

[NOTE: This question appears to be about recent F1 data (2024 season or later). If you don't have verified information about this, please let the user know that you may not have the most current data and suggest they check official F1 sources.]`;
      }
    }

    console.log('Sending to Lyzr AI agent...');
    
    // Call the Lyzr AI agent
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYSR_API_KEY,
      },
      body: JSON.stringify({
        user_id: 's.akshath31@gmail.com',
        agent_id: '68e2a2ad1d634c8310981140',
        session_id: session_id || '68e2a2ad1d634c8310981140-default',
        message: augmentedMessage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lyzr API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Lyzr response received successfully');

    return new Response(
      JSON.stringify({ 
        response: data.response,
        usedLiveData: isTimeSensitiveF1Query(message)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in f1-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
