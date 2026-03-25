import json

def recommend_destinations(budget: float, interest: str, currency: str = "USD") -> dict:
    """
    Rule-based travel destination recommendation system.
    
    Inputs:
        budget (float): The user's budget.
        interest (str): The user's interest (e.g., 'beach', 'mountains', 'adventure', 'city').
        
    Returns:
        dict: Dictionary containing the recommended destinations.
    """
    # Expanded Destination Database
    DESTINATIONS = {
        "nearby": {
            "beach": [
                {"name": "Gokarna", "famous_for": "Pristine beaches and Mahabaleshwar Temple", "image_url": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Tarkarli", "famous_for": "Scuba diving and white sand beaches", "image_url": "https://images.unsplash.com/photo-1589982841216-248c9def8f91?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Alibaug", "famous_for": "Coastal forts and black sand beaches", "image_url": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Ganpatipule", "famous_for": "Swayambhu Ganpati temple and clear waters", "image_url": "https://images.unsplash.com/photo-1622308644420-a61b8fbc8a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "mountains": [
                {"name": "Lonavala", "famous_for": "Chikki, hills, and monsoon waterfalls", "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Mahabaleshwar", "famous_for": "Strawberries and scenic viewpoints", "image_url": "https://images.unsplash.com/photo-1593188231157-224831f2425e?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Matheran", "famous_for": "Eco-friendly vehicle-free hill station", "image_url": "https://images.unsplash.com/photo-1629705910408-72547b74f4b2?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Bhandardara", "famous_for": "Arthur Lake and Randha Falls", "image_url": "https://images.unsplash.com/photo-1605307524956-620e7df6c63b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "adventure": [
                {"name": "Rishikesh", "famous_for": "River rafting and yoga capital", "image_url": "https://images.unsplash.com/photo-1614082242765-a3d690994f3c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Kolad", "famous_for": "White water rafting on Kundalika river", "image_url": "https://images.unsplash.com/photo-1530263302482-058f437a3de7?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Kamshet", "famous_for": "Paragliding over scenic lakes", "image_url": "https://images.unsplash.com/photo-1564391779229-c421fbc4bc03?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Sandhan Valley", "famous_for": "Trekking in the Valley of Shadows", "image_url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "city": [
                {"name": "Pune", "famous_for": "Oxford of the East and Peshwa history", "image_url": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Jaipur", "famous_for": "The Pink City and royal palaces", "image_url": "https://images.unsplash.com/photo-1599661046289-e31897843e41?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Nashik", "famous_for": "Vineyards and ancient temples", "image_url": "https://images.unsplash.com/photo-1602706316654-20b171c7d6fc?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Aurangabad", "famous_for": "Gateway to Ajanta and Ellora Caves", "image_url": "https://images.unsplash.com/photo-1622308644420-a61b8fbc8a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "culture": [
                {"name": "Hampi", "famous_for": "UNESCO ruins of Vijayanagara Empire", "image_url": "https://images.unsplash.com/photo-1600100397561-433ff4b4d08b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Varanasi", "famous_for": "Oldest living city and Ganga Aarti", "image_url": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Ajanta & Ellora", "famous_for": "Ancient rock-cut Buddhist caves", "image_url": "https://images.unsplash.com/photo-1622308644420-a61b8fbc8a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Puri", "famous_for": "Jagannath Temple and rich heritage", "image_url": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "nature": [
                {"name": "Matheran", "famous_for": "Asia's only automobile-free hill station", "image_url": "https://images.unsplash.com/photo-1629705910408-72547b74f4b2?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Kaas Plateau", "famous_for": "Valley of Flowers of Maharashtra", "image_url": "https://images.unsplash.com/photo-1539667468225-bdfd1140e6d6?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Igatpuri", "famous_for": "Vipassana International Academy and misty peaks", "image_url": "https://images.unsplash.com/photo-1605307524956-620e7df6c63b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Amboli", "famous_for": "Biodiverse jungle and pouring waterfalls", "image_url": "https://images.unsplash.com/photo-1593188231157-224831f2425e?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ]
        },
        "domestic": {
            "beach": [
                {"name": "Goa", "famous_for": "Nightlife, beaches, and Portuguese architecture", "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Pondicherry", "famous_for": "French Quarter and spiritual retreats", "image_url": "https://images.unsplash.com/photo-1589976910589-3b46a7c1cf1f?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Varkala", "famous_for": "Dramatic red cliffs and healing waters", "image_url": "https://images.unsplash.com/photo-1602706316654-20b171c7d6fc?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Havelock Island", "famous_for": "Radhanagar Beach and scuba diving", "image_url": "https://images.unsplash.com/photo-1589308454676-419b67f39420?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "mountains": [
                {"name": "Manali", "famous_for": "Snow sports and Solang Valley", "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Shimla", "famous_for": "The Mall Road and colonial charm", "image_url": "https://images.unsplash.com/photo-1591147133314-539091807662?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Darjeeling", "famous_for": "Tea gardens and the Kanchenjunga view", "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Munnar", "famous_for": "Rolling lush green tea plantations", "image_url": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "adventure": [
                {"name": "Bir Billing", "famous_for": "Paragliding capital of India", "image_url": "https://images.unsplash.com/photo-1564391779229-c421fbc4bc03?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Dandeli", "famous_for": "Wildlife sanctuary and river rafting", "image_url": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Auli", "famous_for": "Pristine ski slopes and Himalayan views", "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Gulmarg", "famous_for": "Trekking and highest gondola rides", "image_url": "https://images.unsplash.com/photo-1629705910408-72547b74f4b2?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "city": [
                {"name": "Mumbai", "famous_for": "Gateway of India and Bollywood", "image_url": "https://images.unsplash.com/photo-1529253355930-dd370baf7495?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Bangalore", "famous_for": "Garden City and Silicon Valley", "image_url": "https://images.unsplash.com/photo-1596422846543-75c6fc1fd5fd?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Delhi", "famous_for": "Red Fort and bustling Chandni Chowk", "image_url": "https://images.unsplash.com/photo-1583095117183-16781615d18d?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Kolkata", "famous_for": "Victoria Memorial and literary heritage", "image_url": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "culture": [
                {"name": "Mysore", "famous_for": "The Grand Palace and Dasara festival", "image_url": "https://images.unsplash.com/photo-1583095117183-16781615d18d?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Kochi", "famous_for": "Chinese fishing nets and spice markets", "image_url": "https://images.unsplash.com/photo-1589976910589-3b46a7c1cf1f?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Udaipur", "famous_for": "The City of Lakes and royal hospitality", "image_url": "https://images.unsplash.com/photo-1599661046289-e31897843e41?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Amritsar", "famous_for": "The Golden Temple and cultural warmth", "image_url": "https://images.unsplash.com/photo-1589308454676-419b67f39420?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "nature": [
                {"name": "Munnar", "famous_for": "Tea plantations and rolling hills", "image_url": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Coorg", "famous_for": "Coffee estates and waterfalls", "image_url": "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Wayanad", "famous_for": "Spice trails and ancient caves", "image_url": "https://images.unsplash.com/photo-1622308644420-a61b8fbc8a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Ooty", "famous_for": "Nilgiri Mountain Railway and botanical gardens", "image_url": "https://images.unsplash.com/photo-1591147133314-539091807662?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ]
        },
        "premium": {
            "beach": [
                {"name": "Andaman & Nicobar", "famous_for": "Coral reefs and Radhanagar Beach", "image_url": "https://images.unsplash.com/photo-1589308454676-419b67f39420?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Maldives (International)", "famous_for": "Overwater bungalows and turquoise lagoons", "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Bali, Indonesia", "famous_for": "Volcanic beaches and tranquil retreats", "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Bora Bora", "famous_for": "Luxury resorts and scuba diving", "image_url": "https://images.unsplash.com/photo-1589308454676-419b67f39420?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "mountains": [
                {"name": "Leh Ladakh", "famous_for": "Monasteries and high mountain passes", "image_url": "https://images.unsplash.com/photo-1543336787-84617df9a656?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Swiss Alps", "famous_for": "Iconic peaks and luxury mountain resorts", "image_url": "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Banff, Canada", "famous_for": "Glacial lakes and majestic Rockies", "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Dolomites, Italy", "famous_for": "Jagged peaks and scenic hikes", "image_url": "https://images.unsplash.com/photo-1629705910408-72547b74f4b2?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "adventure": [
                {"name": "Spiti Valley", "famous_for": "Cold desert and Buddhist heritage", "image_url": "https://images.unsplash.com/photo-1543336787-84617df9a656?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Queenstown, NZ", "famous_for": "Bungee jumping and alpine thrills", "image_url": "https://images.unsplash.com/photo-1564391779229-c421fbc4bc03?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Patagonia, Chile", "famous_for": "Glacier trekking and extreme landscapes", "image_url": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Costa Rica", "famous_for": "Ziplining and rich rainforests", "image_url": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "city": [
                {"name": "Dubai (International)", "famous_for": "Burj Khalifa and luxury shopping", "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Singapore (International)", "famous_for": "Gardens by the Bay and diverse culture", "image_url": "https://images.unsplash.com/photo-1525625230556-8e8adca1243b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Tokyo, Japan", "famous_for": "Neon lights and futuristic experiences", "image_url": "https://images.unsplash.com/photo-1529253355930-dd370baf7495?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "New York City", "famous_for": "Times Square and iconic skyscrapers", "image_url": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "culture": [
                {"name": "Kyoto, Japan", "famous_for": "Ancient temples and Geisha districts", "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Florence, Italy", "famous_for": "Renaissance art and world-class museums", "image_url": "https://images.unsplash.com/photo-1541292388414-04e2a106e232?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Machu Picchu, Peru", "famous_for": "Inca citadel set high in the Andes", "image_url": "https://images.unsplash.com/photo-1622308644420-a61b8fbc8a23?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Rome, Italy", "famous_for": "Colosseum and ancient historical ruins", "image_url": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ],
            "nature": [
                {"name": "Swiss Alps", "famous_for": "Iconic peaks and luxury mountain resorts", "image_url": "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Iceland", "famous_for": "Northern lights, glaciers, and volcanoes", "image_url": "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Serengeti, Tanzania", "famous_for": "Wildlife safaris and great migrations", "image_url": "https://images.unsplash.com/photo-1589308454676-419b67f39420?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"},
                {"name": "Amazon Rainforest", "famous_for": "The lungs of the Earth and exotic species", "image_url": "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"}
            ]
        }
    }

    # Normalize budget to INR-like thresholds (approx 10000 INR = 125 USD)
    # This ensures the rule-based logic works for other currencies.
    normalized_budget = budget
    if currency == "USD": normalized_budget = budget * 80
    elif currency == "EUR": normalized_budget = budget * 90
    elif currency == "GBP": normalized_budget = budget * 100
    elif currency == "CAD" or currency == "AUD": normalized_budget = budget * 60
    elif currency == "JPY": normalized_budget = budget * 0.55
    
    tier = "premium"
    category = "Premium"
    
    if normalized_budget < 10000:
        tier = "nearby"
        category = "Nearby"
    elif 10000 <= normalized_budget <= 20000:
        tier = "domestic"
        category = "Popular Domestic"
    else:
        tier = "premium"
        category = "Premium"

    # Select recommendations based on interest or default
    tier_data = DESTINATIONS.get(tier, DESTINATIONS["premium"])
    recommendations = tier_data.get(interest, tier_data.get("culture", []))

    # Construct the final response dictionary
    response_data = {
        "input_budget": budget,
        "input_currency": currency,
        "input_interest": interest,
        "recommendation_category": category,
        "recommended_destinations": recommendations
    }
    
    # Return as dictionary
    return response_data

if __name__ == "__main__":
    # Test cases representing the logic examples
    print("Test 1 (Budget: 8000, Interest: mountains, Currency: INR):")
    print(json.dumps(recommend_destinations(8000, "mountains", "INR"), indent=4))
    
    print("\nTest 2 (Budget: 15000, Interest: beach, Currency: INR):")
    print(json.dumps(recommend_destinations(15000, "beach", "INR"), indent=4))
    
    print("\nTest 3 (Budget: 25000, Interest: any, Currency: USD):")
    print(json.dumps(recommend_destinations(25000, "any", "USD"), indent=4))
