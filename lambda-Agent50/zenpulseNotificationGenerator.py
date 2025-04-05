import json
import os
import boto3
import openai
import uuid
from datetime import datetime

# 🔐 Load API Key
openai.api_key = os.environ["OPENAI_API_KEY"]

# 🛠️ AWS Clients
eventbridge = boto3.client("events")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ZenpulseNotificationLogs")

# 📦 Lifecycle Steps
lifecycles = {
    "ecom": ["Added to cart"],
    "banking": [
        "New account created", "Welcome email sent", "First deposit made",
        "Spending insights available", "Statement ready", "Low balance alert"
    ],
    "support": [
        "Ticket created", "Agent assigned", "Customer replied",
        "Agent responded", "Ticket resolved", "Feedback request sent"
    ]
}

def lambda_handler(event, context):
    print("🔥 Received event:", json.dumps(event))

    # 🛡️ Handle CORS Preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        print("🛡️ CORS preflight triggered — responding with headers")
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            "body": json.dumps({"message": "CORS preflight successful"})
        }

    try:
        # 🧠 Decode body (for HTTP API v2)
        body = json.loads(event.get("body", "{}"))

        type_class = body.get("simType", "ecom")
        customer_count = int(body.get("customers", 1))

        channels_dict = body.get("channels", {})
        channels = [ch for ch, val in channels_dict.items() if val is True]

        if not channels:
            print("❌ ERROR: Missing or invalid 'channels' in payload")
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No valid channels provided"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        messages = []

        for i in range(customer_count):
            for step in lifecycles.get(type_class, []):
                # 💬 Generate message with OpenAI
                prompt = f"Generate a notification message for a customer at step '{step}' in the {type_class} industry."
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}]
                )
                notification_text = response.choices[0].message["content"].strip()

                for ch in channels:
                    destination = (
                        body.get("email") if ch == "email" else
                        body.get("phone") if ch == "sms" else
                        body.get("slack") if ch == "slack" else
                        body.get("push") if ch == "push" else None
                    )

                    print(f"📤 Dispatching {ch} to {destination} | Step: {step}")

                    # 🚀 Push to EventBridge
                    eb_response = eventbridge.put_events(
                        Entries=[
                            {
                                "Source": "zenpulse.generator",
                                "DetailType": "NotificationDispatch",
                                "Detail": json.dumps({
                                    "channel": ch,
                                    "step": step,
                                    "customer": i + 1,
                                    "message": notification_text,
                                    "to": destination
                                }),
                                "EventBusName": "zenpulse-events"
                            }
                        ]
                    )
                    print("✅ EventBridge response:", eb_response)

                    # 💾 Log to DynamoDB
                    table.put_item(Item={
                        'id': str(uuid.uuid4()),
                        'timestamp': datetime.utcnow().isoformat(),
                        'typeClass': type_class,
                        'channel': ch,
                        'customer': i + 1,
                        'step': step,
                        'message': notification_text
                    })

                    # 🧾 Append message to result
                    messages.append({
                        "customer": i + 1,
                        "step": step,
                        "message": notification_text
                    })

        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "success",
                "total": len(messages),
                "messages": messages
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"status": "error", "message": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

