import asyncio
import uuid
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.main import plan_trip
from backend.models import TripRequest

async def test():
    req = TripRequest(destination="Paris", budget=1000, days=3, interests=[])
    try:
        res = await plan_trip(req)
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
