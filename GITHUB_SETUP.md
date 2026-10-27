# Create your GitHub repository

1. Sign in to GitHub and choose **New repository**.
2. Repository name suggestion: `staffsync-hr-portal`.
3. Choose Public or Private according to your course requirements. Do not add a README, `.gitignore`, or license on GitHub because these files are already in this project folder.
4. On your computer, extract this project folder and open a terminal inside it.
5. Run:

```bash
git init
git add .
git commit -m "Set up StaffSync HR portal"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/staffsync-hr-portal.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username and use the exact repository URL GitHub shows you. If Git asks you to authenticate, complete the sign-in flow in your browser; do not put a password or token in this file.

Before pushing, verify that `.env` files, database credentials, and personal data are not staged. The `.gitignore` excludes `.env` files by default.
