import os
import json
from dotenv import load_dotenv

load_dotenv()

# OpenRouter Drop-in Replacement via OpenAI SDK
try:
    from openai import AsyncOpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

class UniversalFallbackModel:
    def __init__(self, key: str):
        self.model = "meta-llama/llama-3.2-3b-instruct:free" # default
        base_url = "https://openrouter.ai/api/v1"
        
        if key.startswith("gsk_"):
            base_url = "https://api.groq.com/openai/v1"
            self.model = "llama-3.3-70b-versatile"
        elif key.startswith("sk-or-"):
            base_url = "https://openrouter.ai/api/v1"
            self.model = "meta-llama/llama-3.2-3b-instruct:free"
        
        self.client = AsyncOpenAI(
            base_url=base_url,
            api_key=key,
            default_headers={"HTTP-Referer": "https://travelsphere.app", "X-Title": "TravelSphere"}
        )
    
    async def generate_content_async(self, prompt: str):
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
        )
        class ResponseStub:
            text = response.choices[0].message.content
        return ResponseStub()

def get_model(api_key: str = None):
    if not HAS_OPENAI:
        return None
    key = api_key or os.getenv("OPENROUTER_API_KEY", "")
    if not key:
        return None
    try:
        return UniversalFallbackModel(key)
    except Exception:
        return None


def _clean_json_text(text: str) -> str:
    """Strip markdown code fences and conversational padding from Gemini responses."""
    text = text.strip()
    
    start_obj = text.find('{')
    start_arr = text.find('[')
    end_obj = text.rfind('}')
    end_arr = text.rfind(']')
    
    start = -1
    if start_obj != -1 and start_arr != -1:
        start = min(start_obj, start_arr)
    elif start_obj != -1:
        start = start_obj
    elif start_arr != -1:
        start = start_arr
        
    end = -1
    if end_obj != -1 and end_arr != -1:
        end = max(end_obj, end_arr)
    elif end_obj != -1:
        end = end_obj
    elif end_arr != -1:
        end = end_arr
        
    if start != -1 and end != -1 and start < end:
        return text[start:end+1]
    return text

async def generate_itinerary(destination: str, days: int, interests: list, budget: float, currency: str = "USD", api_key: str = None) -> list:
    """Generate a daily itinerary using Gemini API."""
    model = get_model(api_key)
    if not model:
        return [
            {
                "day": f"Day {i}",
                "activities": [
                    {
                        "label": "Breakfast",
                        "time_slot": "08:00 AM - 09:00 AM",
                        "location": f"Local Cafe, {destination}",
                        "description": "Start the day with a light local breakfast and review the day's roadmap.",
                        "reviews_summary": "4.5 stars - highly recommended by locals.",
                        "distance_to_next": "0.5 miles",
                        "travel_recommendation": "A short 10-minute walk."
                    },
                    {
                        "label": "Morning Tour",
                        "time_slot": "09:30 AM - 12:00 PM",
                        "location": f"Central Historical District, {destination}",
                        "description": f"Guided walking tour exploring {destination}'s history and main landmarks.",
                        "reviews_summary": "4.8 stars - a must-see historical site.",
                        "distance_to_next": "2.0 miles",
                        "travel_recommendation": "Take a local taxi or the downtown bus line."
                    },
                    {
                        "label": "Lunch",
                        "time_slot": "12:30 PM - 01:30 PM",
                        "location": "Avenue Bistro",
                        "description": "Relaxed lunch featuring traditional regional cuisine.",
                        "reviews_summary": "4.3 stars - excellent ambiance and food.",
                        "distance_to_next": "1.5 miles",
                        "travel_recommendation": "A pleasant stroll through the city center."
                    },
                    {
                        "label": "Afternoon Activity",
                        "time_slot": "02:00 PM - 04:30 PM",
                        "location": f"{interests[0] if interests else 'Cultural Museum'}",
                        "description": f"Deep dive into {interests[0] if interests else 'local arts and culture'} through immersive exhibits.",
                        "reviews_summary": "4.7 stars - captivating exhibits.",
                        "distance_to_next": "3.0 miles",
                        "travel_recommendation": "Take the metro to the dining district."
                    },
                    {
                        "label": "Dinner",
                        "time_slot": "06:30 PM - 08:30 PM",
                        "location": "Highly-rated Restaurant",
                        "description": "Enjoy a curated multi-course dinner with local delicacies.",
                        "reviews_summary": "4.9 stars - fine dining experience.",
                        "distance_to_next": "1.0 miles",
                        "travel_recommendation": "Walk back towards the center."
                    },
                    {
                        "label": "Evening Leisure",
                        "time_slot": "08:30 PM - 10:00 PM",
                        "location": "City Center Public Square",
                        "description": "Evening stroll and relaxation to take in the bustling night atmosphere.",
                        "reviews_summary": "4.6 stars - great for people-watching.",
                        "distance_to_next": "N/A",
                        "travel_recommendation": "Return to your accommodation."
                    }
                ]
            }
            for i in range(1, days + 1)
        ]

    prompt = (
        f"Create a very detailed, step-by-step {days}-day timetable travel itinerary for {destination} with a budget of {budget} {currency}. "
        f"Interests include: {', '.join(interests)}. "
        f"Provide a COMPREHENSIVE daily roadmap for the whole day. You MUST include at least 6 to 8 detailed activities per day (e.g. Breakfast, Morning Activity, Lunch, Afternoon Activity, Dinner, Evening Leisure). "
        f"Expand the itinerary to include step-by-step guidance on exactly where to go, what to visit, and what to do, with precise times and specific location names. "
        f"Return ONLY a valid JSON object (no markdown, no code fences) containing an 'itinerary' array. "
        f"Each item in the array must have these keys: "
        f"'day' (string, e.g., 'Day 1'), "
        f"'activities' (an array of activity objects). "
        f"Each activity object must have these string keys: "
        f"'time_slot' (e.g. '08:00 AM - 10:00 AM'), "
        f"'location' (specific place name), "
        f"'description' (detailed step-by-step instruction), "
        f"'label' (e.g. 'Breakfast', 'Morning Tour'), "
        f"'reviews_summary' (a compelling short summary of reviews/ratings, e.g., '4.8 stars - Famous for its vintage ambiance.'), "
        f"'distance_to_next' (distance to next location, e.g. '1.2 km' or 'N/A' if last activity), and "
        f"'travel_recommendation' (e.g. 'Take a 15-minute scenic walk' or 'Use the Metro')."
    )

    try:
        response = await model.generate_content_async(prompt)
        data = json.loads(_clean_json_text(response.text))
        return data.get("itinerary", data) if isinstance(data, dict) else data
    except Exception as e:
        print(f"Gemini Error: {e}")
        return [{
            "day": "Day 1",
            "activities": [
                {
                    "label": "Error",
                    "time_slot": "",
                    "location": "",
                    "description": "AI generation failed. Please check your API key.",
                    "reviews_summary": "N/A",
                    "distance_to_next": "N/A",
                    "travel_recommendation": "N/A"
                }
            ]
        }]


async def generate_packing_list(destination: str, days: int, api_key: str = None) -> list:
    """Generate packing suggestions using Gemini API."""
    model = get_model(api_key)
    if not model:
        return ["Passport", "Clothes", "Toothbrush", "Camera", "Charger", "Sunscreen"]

    prompt = (
        f"Provide a concise packing list for a {days}-day trip to {destination}. "
        f"Return ONLY a valid JSON array of strings, no markdown."
    )
    try:
        response = await model.generate_content_async(prompt)
        return json.loads(_clean_json_text(response.text))
    except Exception:
        return ["Passport", "Clothes", "Toothbrush", "Camera"]


async def generate_categorized_packing_list(destination: str, days: int, weather: str = "", api_key: str = None) -> dict:
    """Generate categorized packing suggestions using Gemini API."""
    model = get_model(api_key)
    if not model:
        return {
            "clothes": ["T-shirts", "Pants", "Jacket"],
            "electronics": ["Phone", "Charger", "Power bank"],
            "essentials": ["Toothbrush", "Toothpaste", "Sunscreen"],
            "documents": ["Passport", "ID", "Tickets"]
        }

    weather_text = f" in {weather} weather" if weather else ""
    prompt = (
        f"Generate a travel packing list for a trip to {destination} for {days} days{weather_text}. "
        f"Categorize items into:\n"
        f"1. Clothes\n"
        f"2. Electronics\n"
        f"3. Travel Essentials\n"
        f"4. Documents\n\n"
        f"Return ONLY a valid JSON object (no markdown) with four keys: 'clothes', 'electronics', 'essentials', 'documents'."
        f"Each key must map to a JSON array of strings."
    )
    try:
        response = await model.generate_content_async(prompt)
        text = response.text
        try:
            parsed = json.loads(_clean_json_text(text))
            # Enforce lowercase keys in case the AI capitalized them based on the numbered list
            if isinstance(parsed, dict):
                parsed = {k.lower(): v for k, v in parsed.items()}
            return parsed
        except Exception as json_e:
            print(f"JSON Parsing Error in Packing List: {json_e}\nRaw Text: {text}")
            return {
                "clothes": [f"Parsing error: {json_e}"],
                "electronics": ["Raw output:", text[:100]],
                "essentials": [],
                "documents": []
            }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "clothes": [f"API Error: {str(e)}"],
            "electronics": [],
            "essentials": [],
            "documents": []
        }



async def recommend_destinations(preferences: list, budget: float, currency: str = "USD", api_key: str = None) -> list:
    """Recommend destinations using Gemini API."""
    model = get_model(api_key)
    if not model:
        return ["Paris, France", "Kyoto, Japan", "Machu Picchu, Peru"]

    prompt = (
        f"Recommend 3 travel destinations for a budget of {budget} {currency} "
        f"and these interests: {', '.join(preferences)}. "
        f"Return ONLY a valid JSON array of strings, no markdown."
    )
    try:
        response = await model.generate_content_async(prompt)
        return json.loads(_clean_json_text(response.text))
    except Exception:
        return ["Paris", "Tokyo", "New York"]

async def estimate_budget(destination: str, origin: str, days: int, currency: str = "USD", api_key: str = None) -> float:
    """Estimate a realistic budget based on destination, origin, and duration."""
    model = get_model(api_key)
    if not model:
        return 1500.0

    prompt = (
        f"Estimate a realistic travel budget in {currency} for a {days}-day trip to {destination} originating from {origin}. "
        f"Consider average flights, mid-range accommodation, daily food, and local transportation. "
        f"Return ONLY a valid JSON object with a single key 'estimated_budget' containing a numeric value (no markdown)."
    )
    try:
        response = await model.generate_content_async(prompt)
        data = json.loads(_clean_json_text(response.text))
        return float(data.get("estimated_budget", 1500.0))
    except Exception:
        return 1500.0
