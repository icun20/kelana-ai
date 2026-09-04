import json

def generate_ai_recommendation(destination: str, days: int) -> str:
    prompt = f"Please generate a structured daily travel plan for a {days}-day trip to {destination}. For each day, provide Morning, Afternoon, and Evening activities."
    
    try:
        import boto3
        import os
        client = boto3.client('bedrock-runtime', region_name='ap-southeast-2')
        response = client.converse(
            modelId='arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.nova-lite-v1:0',
            messages=[{"role": "user", "content": [{"text": prompt}]}]
        )
        return response['output']['message']['content'][0]['text']
    except Exception as e:
        return f"[AWS Bedrock Error]: {e}"



def generate_chat_response(history, new_message, destination):
    import boto3
    import os
    
    messages = []
    for msg in history:
        messages.append({"role": msg.role, "content": [{"text": msg.content}]})
    
    messages.append({"role": "user", "content": [{"text": new_message}]})
    
    try:
        client = boto3.client(
            'bedrock-runtime', 
            region_name='ap-southeast-2',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID', None),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY', None)
        )
        
        response = client.converse(
            modelId='arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.nova-lite-v1:0',
            messages=messages,
            system=[{"text": f"You are a helpful travel assistant helping the user plan a trip to {destination}."}]
        )
        return response['output']['message']['content'][0]['text']
    except Exception as e:
        return f"[AWS Bedrock Error]: {e}"
