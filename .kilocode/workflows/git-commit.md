# Git Commit Workflow

Commit changes with AI-generated conventional commit messages.

## Steps

1. Run `git status` to check for changes

2. If no changes, report "Nothing to commit" and exit

3. Analyze changes to determine commit type:
   - `feat`: New files in app/, components/, hooks/, new functionality
   - `fix`: Bug fixes, error corrections
   - `docs`: README, Memory Bank, documentation changes
   - `refactor`: Code restructuring without behavior change
   - `style`: Tailwind/CSS changes, formatting
   - `chore`: Config files, .gitignore, build changes

4. Generate conventional commit message:
   ```
   type(scope): concise summary (max 72 chars)
   
   - Key change 1
   - Key change 2
   
   [Kilo Code assisted]
   ```

5. Stage all changes:
   ```bash
   git add -A
   ```

6. Commit with generated message:
   ```bash
   git commit -m "message"
   ```

7. Push to remote automatically:
   ```bash
   git push
   ```

8. Report completion with commit hash and push status

## Usage

This workflow can be triggered:
- Automatically after `/add-feature.md` completes
- Manually via `/git-commit.md` command
- After significant changes when AI suggests it