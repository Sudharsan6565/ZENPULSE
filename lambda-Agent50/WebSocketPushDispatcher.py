import json
import boto3
import os
import time

# Setup DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

# Pull WebSocket endpoint from env
ws_endpoint = os.environ.get("WS_ENDPOINT")

# Patch: Ensure WebSocket endpoint is present
if not ws_endpoint:
    raise Exception("❌ WS_ENDPOINT environment variable is missing!")

# Initialize API Gateway Management client
apigw = boto3.client("apigatewaymanagementapi", endpoint_url=ws_endpoint)

def lambda_handler(event, context):
    print("🔥 Event received:", json.dumps(event))

    route_key = event.get("requestContext", {}).get("routeKey")
    connection_id = event.get("requestContext", {}).get("connectionId")

    # Handle connection events
    if route_key == "$connect":
        print(f"✅ $connect: storing {connection_id}")
        table.put_item(Item={
            "connectionId": connection_id,
            "timestamp": int(time.time())
        })
        return {"statusCode": 200, "body": "Connected"}

    elif route_key == "$disconnect":
        print(f"❌ $disconnect: removing {connection_id}")
        table.delete_item(Key={"connectionId": connection_id})
        return {"statusCode": 200, "body": "Disconnected"}

    elif route_key == "sendMessage":
        body = json.loads(event.get("body", "{}"))
        message = body.get("message", "Default message")
        print(f"📤 Echoing to {connection_id}: {message}")
        try:
            apigw.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps({
                    "channel": "push",
                    "from": "Wilme4CEO",
                    "message": message
                }).encode("utf-8")
            )
            return {"statusCode": 200, "body": "Message sent"}
        except Exception as e:
            print(f"❌ Failed to echo: {str(e)}")
            return {"statusCode": 500, "body": f"Error: {str(e)}"}

    # Handle EventBridge triggers (broadcast to all)
    else:
        try:
            detail = event.get("detail", {})
            message = detail.get("message", "No message found.")
            print("🔎 EventBridge detail:", json.dumps(detail))

            response = table.scan(ProjectionExpression="connectionId")
            connections = response.get("Items", [])
            print(f"📡 Broadcasting to {len(connections)} connections.")

            for conn in connections:
                try:
                    apigw.post_to_connection(
                        ConnectionId=conn["connectionId"],
                        Data=json.dumps({
                            "channel": "push",
                            "from": "EventBridge",
                            "message": message
                        }).encode("utf-8")
                    )
                except Exception as e:
                    print(f"⚠️ Failed to push to {conn['connectionId']}: {str(e)}")

            return {"statusCode": 200, "body": "EventBridge push sent"}

        except Exception as e:
            print(f"🔥 Broadcast failed: {str(e)}")
            return {"statusCode": 500, "body": f"Error: {str(e)}"}

