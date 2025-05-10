
# Welcome to your Lovable project - Automated Finance Hub

## Project info

**URL**: https://lovable.dev/projects/2bd6e203-6f35-45b2-8a3e-bedeae794da1

## GitHub Pages Deployment Instructions

Since we can't directly modify package.json, follow these manual steps to deploy to GitHub Pages:

1. Clone the repository to your local machine
2. Build the project: `npm run build`
3. Create a new branch called `gh-pages`
4. Copy the contents of the `dist` folder to the root of the `gh-pages` branch
5. Push the `gh-pages` branch to GitHub
6. In your GitHub repository settings, enable GitHub Pages and select the `gh-pages` branch

Alternatively, you can use a GitHub Action workflow for automatic deployment.
Create a file `.github/workflows/deploy.yml` in your repository with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3
        
      - name: Install and Build 🔧
        run: |
          npm ci
          npm run build
          
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2bd6e203-6f35-45b2-8a3e-bedeae794da1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2bd6e203-6f35-45b2-8a3e-bedeae794da1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
