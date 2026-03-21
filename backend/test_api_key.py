import sys
import os

try:
    from openai import OpenAI
except ImportError:
    print("openai is not installed. Run: pip install openai")
    sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_api_key.py <YOUR_API_KEY>")
        sys.exit(1)

    api_key = sys.argv[1]
    
    print("Testing Universal AI Model API Key...")
    
    model = "meta-llama/llama-3.2-3b-instruct:free"
    base_url = "https://openrouter.ai/api/v1"
    
    if api_key.startswith("gsk_"):
        base_url = "https://api.groq.com/openai/v1"
        model = "llama-3.3-70b-versatile"
        print("Detected Groq Key! Fast JSON models incoming...")
    elif api_key.startswith("sk-or"):
        base_url = "https://openrouter.ai/api/v1"
        model = "meta-llama/llama-3.2-3b-instruct:free"
        print("Detected OpenRouter Key!")
        
    client = OpenAI(
        base_url=base_url,
        api_key=api_key,
        default_headers={"HTTP-Referer": "https://travelsphere.app", "X-Title": "TravelSphere"}
    )
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Please say 'API works flawlessly!'"}],
        )
        print("\n✅ SUCCESS! Your API key is actively working.")
        print("AI says:", response.choices[0].message.content.strip())
    except Exception as e:
        print("\n❌ FAILED. Your API key might be invalid or heavily rate-limited.")
        print("Exact Error:", str(e))

if __name__ == "__main__":
    main()
