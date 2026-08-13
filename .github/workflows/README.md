# Hansbury Teams Message

Posts a scheduled Adaptive Card message to a Teams chat via a Power Automate webhook.

## Setup

1. Create the webhook in Teams:
   - Workflows app → search "webhook" → "Post to a chat when a webhook request is received"
   - Or build from scratch: trigger "When a Teams webhook request is received" → action "Post message in a chat or channel"
2. Add the generated URL as a repo secret named `TEAMS_WEBHOOK_URL`
   (Settings → Secrets and variables → Actions → New repository secret)
3. Edit `send-message.sh` — update the leaderboard URL and message text as needed
4. Test manually: Actions tab → Scheduled Teams Message → Run workflow
5. Adjust the cron schedule in `teams-message.yml` — times are UTC

## Notes

- Cron doesn't adjust for BST automatically — check the offset each time the clocks change
- Scheduled workflows only run on the default branch
- If the repo has no activity for 60 days, GitHub can disable the schedule — a commit resets it
