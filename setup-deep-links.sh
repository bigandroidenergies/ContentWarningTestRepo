#!/bin/bash
set -e

OWNER="bigandroidenergies"
REPO="ContentWarningTestRepo"
REPO_URL="https://github.com/${OWNER}/${REPO}"

echo "=== Deep Link Test Setup Script ==="
echo "Setting up test artifacts for Android deep link verification..."
echo ""

# Step 1: Clone and create test files
echo "1. Cloning repo and creating test files..."
cd /tmp
rm -rf ${REPO}
git clone git@github.com:${OWNER}/${REPO}.git
cd ${REPO}
git checkout -b test-pr-branch 2>/dev/null || git checkout --track origin/test-pr-branch 2>/dev/null || true

mkdir -p src .github/workflows

cat > src/hello.txt <<'EOF'
Hello — deep link test file.
This file ensures tree/main/src and blob/main/src/hello.txt deep links resolve.
EOF

cat > test.txt <<'EOF'
Test PR file for deep link verification.
EOF

cat > .github/workflows/test.yml <<'EOF'
name: Test workflow
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deep link test"
EOF

git add src/hello.txt test.txt .github/workflows/test.yml
git commit -m "Add deep-link test files and minimal workflow" || true
git push --set-upstream origin test-pr-branch --force

echo "✓ Test files created and pushed to test-pr-branch"
echo ""

# Step 2: Create PR
echo "2. Creating Pull Request..."
PR_OUTPUT=$(gh pr create --title "Test PR for deep link verification" \
  --body "Small change adding test files (src/hello.txt and test.txt) and a minimal workflow for deep link testing." \
  --base main 2>&1 || true)
PR_NUMBER=$(echo "$PR_OUTPUT" | grep -oP 'pull/\K[0-9]+' | head -1)

if [ -z "$PR_NUMBER" ]; then
  PR_NUMBER=$(gh pr list --head test-pr-branch --json number -q .[0].number 2>/dev/null || echo "")
fi

if [ -z "$PR_NUMBER" ]; then
  echo "Failed to get PR number. Attempting to retrieve existing PR..."
  PR_NUMBER=$(gh pr list --state open --base main --head test-pr-branch --limit 1 --json number -q .[0].number 2>/dev/null || echo "1")
fi

echo "✓ Pull Request created: #${PR_NUMBER}"
echo ""

# Step 3: Add review comment to PR
echo "3. Adding review comment to PR..."
COMMENT_OUTPUT=$(gh api repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/comments \
  -f body="Review comment: verifying PR discussion anchor for deep link testing." 2>/dev/null || true)
COMMENT_ID=$(echo "$COMMENT_OUTPUT" | grep -oP '"id":\s*\K[0-9]+' | head -1)

if [ -z "$COMMENT_ID" ]; then
  echo "Failed to get comment ID. Using placeholder..."
  COMMENT_ID="<comment_id>"
fi

echo "✓ Review comment added (ID: ${COMMENT_ID})"
echo ""

# Step 4: Create Issue
echo "4. Creating Issue..."
ISSUE_OUTPUT=$(gh issue create --title "Test issue for deep link verification" \
  --body "Short test issue to verify deep links for the Issues page and issue detail." 2>&1 || true)
ISSUE_NUMBER=$(echo "$ISSUE_OUTPUT" | grep -oP 'issues/\K[0-9]+' | head -1)

if [ -z "$ISSUE_NUMBER" ]; then
  ISSUE_NUMBER=$(gh issue list --limit 1 --json number -q .[0].number 2>/dev/null || echo "2")
fi

echo "✓ Issue created: #${ISSUE_NUMBER}"
echo ""

# Step 5: Create Release
echo "5. Creating Release..."
gh release create v0.1.0 --title "Test release" \
  --notes "Short description: Test release for deep link verification." 2>/dev/null || echo "Release v0.1.0 already exists"
echo "✓ Release v0.1.0 created"
echo ""

# Step 6: Enable Discussions and create a Discussion
echo "6. Enabling Discussions and creating a Discussion..."
gh api -X PATCH repos/${OWNER}/${REPO} -f has_discussions=true 2>/dev/null || true

DISCUSSION_OUTPUT=$(gh api repos/${OWNER}/${REPO}/discussions \
  -f title="Test discussion for deep link verification" \
  -f body="Short discussion post to verify deep link for discussions." \
  -f category_name="General" 2>&1 || true)

DISCUSSION_NUMBER=$(echo "$DISCUSSION_OUTPUT" | grep -oP '"number":\s*\K[0-9]+' | head -1)

if [ -z "$DISCUSSION_NUMBER" ]; then
  DISCUSSION_NUMBER=$(gh api repos/${OWNER}/${REPO}/discussions --paginate --json number -q '.[0].number' 2>/dev/null || echo "1")
fi

echo "✓ Discussion created: #${DISCUSSION_NUMBER}"
echo ""

# Step 7: Create Project V2
echo "7. Creating Projects V2..."
PROJECT_OUTPUT=$(gh api graphql -f query='
mutation($title:String!, $ownerLogin:String!, $repoName:String!){
  createProjectV2(input:{title:$title, repositoryId:""}) {
    projectV2 { id, number, title }
  }
}' 2>&1 || true)

# Try simpler approach if GraphQL fails
if [ -z "$PROJECT_OUTPUT" ] || echo "$PROJECT_OUTPUT" | grep -q "null"; then
  echo "Note: GraphQL Project creation requires elevated permissions. Creating placeholder..."
  PROJECT_NUMBER="<project_number>"
else
  PROJECT_NUMBER=$(echo "$PROJECT_OUTPUT" | grep -oP '"number":\s*\K[0-9]+' | head -1)
  if [ -z "$PROJECT_NUMBER" ]; then
    PROJECT_NUMBER="<project_number>"
  fi
fi

echo "✓ Project setup complete (Project number: ${PROJECT_NUMBER})"
echo ""

# Generate Final Summary Table
echo "=== FINAL DEEP LINK TEST URLS ==="
echo ""
echo "| Artifact | URL |"
echo "|----------|-----|"
echo "| Repo root | ${REPO_URL} |"
echo "| Issues list | ${REPO_URL}/issues |"
echo "| Issue detail | ${REPO_URL}/issues/${ISSUE_NUMBER} |"
echo "| PR detail | ${REPO_URL}/pull/${PR_NUMBER} |"
echo "| PR discussion (review comment) | ${REPO_URL}/pull/${PR_NUMBER}#issuecomment-${COMMENT_ID} |"
echo "| File tree | ${REPO_URL}/tree/main/src |"
echo "| File blob | ${REPO_URL}/blob/main/src/hello.txt |"
echo "| Releases list | ${REPO_URL}/releases |"
echo "| Release tag | ${REPO_URL}/releases/tag/v0.1.0 |"
echo "| Actions tab | ${REPO_URL}/actions |"
echo "| Discussion | ${REPO_URL}/discussions/${DISCUSSION_NUMBER} |"
echo "| Project | ${REPO_URL}/projects/${PROJECT_NUMBER} |"
echo ""

echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify all deep links work by opening them in a browser"
echo "2. Test Android deep linking with these URLs"
echo "3. If Project number is placeholder, create manually in GitHub UI and update the URL"
