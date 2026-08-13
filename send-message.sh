#!/bin/bash
set -e

if [ -z "$TEAMS_WEBHOOK_URL" ]; then
  echo "Error: TEAMS_WEBHOOK_URL is not set."
  exit 1
fi

PAYLOAD=$(cat <<'EOF'
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.4",
        "body": [
          {
            "type": "TextBlock",
            "text": "SIPs Leaderboard",
            "weight": "Bolder",
            "size": "Medium"
          },
          {
            "type": "TextBlock",
            "text": "View Full Scorecard.",
            "wrap": true
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "View leaderboard",
            "url": "https://hansbury-sip-pulse.base44.app"
          }
        ]
      }
    }
  ]
}
EOF
)

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -d "$PAYLOAD" "$TEAMS_WEBHOOK_URL")

if [ "$RESPONSE" -ge 200 ] && [ "$RESPONSE" -lt 300 ]; then
  echo "Message posted successfully (HTTP $RESPONSE)"
else
  echo "Failed to post message (HTTP $RESPONSE)"
  exit 1
fi
