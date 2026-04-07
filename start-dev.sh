#!/bin/bash
export PATH="$HOME/.bun/bin:$PATH"
cd /Users/gregpolinger/.claude/worktrees/agent-a71f3ce6/investment-dashboard
exec bun run dev --port 3101
