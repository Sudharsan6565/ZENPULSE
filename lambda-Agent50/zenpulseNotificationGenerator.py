import json
import os
import boto3
import openai
import uuid
import decimal
from datetime import datetime
from boto3.dynamodb.conditions import Attr

# 🔐 Set OpenAI Key
openai.api_key = os.environ["OPENAI_API_KEY"]

# 🛠️ AWS Clients
eventbridge = boto3.client("events")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("ZenpulseNotificationLogs")

# 🌀 Lifecycle map
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

# 🧠 Decimal serializer
def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    print("🔥 Received event:", json.dumps(event))

    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")

    # 🛡️ Handle preflight CORS
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            "body": json.dumps({"message": "CORS preflight OK"})
        }

    # 📥 GET method — Fetch logs
    if method == "GET":
        try:
            query_params = event.get("queryStringParameters") or {}
            channel = query_params.get("channel")

            if not channel:
                data = table.scan()
            else:
                data = table.scan(FilterExpression=Attr("channel").eq(channel))

            items = data.get("Items", [])
            recent = sorted(items, key=lambda x: x["timestamp"], reverse=True)[:5]

            return {
                "statusCode": 200,
                "body": json.dumps({"items": recent}, default=decimal_default),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        except Exception as e:
            print("❌ GET error:", str(e))
            return {
                "statusCode": 500,
                "body": json.dumps({
                    "error": "Failed to retrieve data",
                    "details": str(e)
                }),
                "headers": {"Access-Control-Allow-Origin": "*"}
            }

    # 🚀 POST method — Dispatch notifications
    try:
        body = json.loads(event.get("body", "{}"))

        type_class = body.get("typeClass", "ecom")
        customer_count = int(body.get("customerCount", 1))

        channels_input = body.get("channels", {})
        if isinstance(channels_input, dict):
            channels = [ch for ch, enabled in channels_input.items() if enabled]
        elif isinstance(channels_input, list):
            channels = channels_input
        else:
            raise ValueError("Invalid channels format")

        if not channels:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No valid channels provided"}),
                "headers": {"Access-Control-Allow-Origin": "*"}
            }

        messages = []

        for i in range(customer_count):
            for step in lifecycles.get(type_class, []):
                prompt = f"Generate a notification message for a customer at step '{step}' in the {type_class} industry."
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}]
                )
                message_text = response.choices[0].message["content"].strip()

                for ch in channels:
                    destination = (
                        body.get("email") if ch == "email" else
                        body.get("phone") if ch == "sms" else
                        body.get("slack") if ch == "slack" else
                        body.get("push") if ch == "push" else None
                    )

                    print(f"📤 Dispatching {ch} → {destination}")

                    eventbridge.put_events(
                        Entries=[{
                            "Source": "zenpulse.generator",
                            "DetailType": "NotificationDispatch",
                            "Detail": json.dumps({
                                "channel": ch,
                                "step": step,
                                "customer": i + 1,
                                "message": message_text,
                                "to": destination
                            }),
                            "EventBusName": "zenpulse-events"
                        }]
                    )

                    table.put_item(Item={
                        "id": str(uuid.uuid4()),
                        "timestamp": datetime.utcnow().isoformat(),
                        "typeClass": type_class,
                        "channel": ch,
                        "customer": i + 1,
                        "step": step,
                        "message": message_text
                    })

                    messages.append({
                        "channel": ch,
                        "step": step,
                        "message": message_text
                    })

        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "success",
                "messages": messages
            }),
            "headers": {"Access-Control-Allow-Origin": "*"}
        }

    except Exception as e:
        print("❌ POST error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Access-Control-Allow-Origin": "*"}
        }

