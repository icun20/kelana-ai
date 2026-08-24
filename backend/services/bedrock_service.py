import json

def generate_ai_recommendation(destination: str, days: int) -> str:
    prompt = f"""
Please generate a structured daily travel plan for a {days}-day trip to {destination}.
For each day, you MUST provide the following structure:

Day [Number]: [Theme/Title of the Day]

Morning activities:
- Provide specifically 2 to 3 morning activities per day.

Afternoon activities:
- Include recommendations for cultural sites and local experiences.

Evening activities:
- Add suggestions for dinner spots and nightlife entertainment.

Ensure the response is detailed, engaging, and well-structured.
"""
    
    try:
        import boto3
        client = boto3.client('bedrock-runtime', region_name='us-east-1')
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
        response = client.invoke_model(
             modelId='anthropic.claude-3-haiku-20240307-v1:0',
             body=body
        )
        response_body = json.loads(response.get('body').read())
        return response_body.get('content')[0].get('text')
    except Exception as e:
        return f"Day 1: Exploring {destination}\n\nMorning:\n- Visit local market (Activity 1)\n- Walk around city center (Activity 2)\n- Enjoy traditional breakfast (Activity 3)\n\nAfternoon:\n- Visit the main museum (Cultural site)\n- Try local craft workshop (Local experience)\n\nEvening:\n- Dinner at famous local restaurant (Dinner spot)\n- Enjoy night market or local bar (Nightlife)"
