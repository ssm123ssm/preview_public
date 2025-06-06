# Preview : publish private Github repos securely

A Next.js application that allows you to securely publish and share content from private GitHub repositories as authenticated websites using Clerk authentication.

## Overview

This tool enables you to:

- Publish rendered web pages from private GitHub repositories
- Share files securely with authentication
- Control access through Clerk's user management system
- Automatically sync content from private repos to your public site

## Getting Started

### Prerequisites

- Node.js and npm installed
- GitHub account with private repositories
- Vercel account for deployment
- Clerk account for authentication

### Setting Up the Dashboard

1. **Clone and Configure Repository**

   ```bash
   git clone https://github.com/ssm123ssm/preview_public.git
   cd preview_public
   ```

   Make sure to set your cloned repository as private.

2. **Generate GitHub Access Token**

   - Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Generate a new token with the following permissions:
     - Repository access: Select your private repository
     - Permissions: Contents (Read and Write), Metadata (Read), Pull requests (Write)
   - Save this token securely

3. **Set Up Clerk Authentication**

   - Register at [Clerk](https://clerk.com)
   - Create a new application
   - Create a test organization named "My organization"
   - Obtain your API keys:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

4. **Configure Environment Variables**
   Create a `.env.local` file in your project root:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

5. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

   Make sure to add your environment variables in the Vercel dashboard under Project Settings → Environment Variables.

## Sharing Content from Private Repositories

### Initial Setup for Content Repository

1. **Configure Repository Secrets**

   - Go to your private repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Add a new repository secret with your GitHub access token

2. **Install Preview Workflow**
   In your private repository root directory:

   ```bash
   npx preview-workflow
   ```

3. **Configure Workflow**
   When prompted, provide:
   - **Action**: Select "create/update"
   - **Directory to share**: Enter the directory of the content you want to publish
   - **Organization name**: Enter "My organization" (must match your Clerk organization)
   - **Preview repository username**: Enter the username of your preview repository

### Publishing Content

1. **Push Your Content**

   ```bash
   git add .
   git commit -m "Add content to publish"
   git push origin main
   ```

2. **Automatic Sync**
   - The GitHub Action will automatically trigger
   - Content will be synced to your preview repository
   - Changes will be available on your deployed site within ~1 minute

### Access Control

- Access your deployed application's dashboard
- Navigate to the Clerk management section
- Control user access and permissions through the Clerk dashboard
- Manage organization members and their access levels

## Workflow Architecture

```
Private Repository → GitHub Actions → Preview Repository → Next.js App → Authenticated Users
```

1. Content is stored in your private GitHub repository
2. GitHub Actions automatically sync specified directories
3. Content is published to a preview repository
4. Next.js app serves the content with Clerk authentication
5. Users authenticate through Clerk to access the content

## Security Features

- **Private Repository Protection**: Original content remains in private repositories
- **Authentication Required**: All content access requires Clerk authentication
- **Fine-grained Permissions**: GitHub tokens use minimal required permissions
- **Organization-based Access**: Content access controlled through Clerk organizations

## Troubleshooting

### Common Issues

**Sync not working**

- Verify your GitHub access token has correct permissions
- Check that the repository secret is properly configured
- Ensure the organization name matches exactly in both Clerk and the workflow

**Authentication issues**

- Verify environment variables are set correctly in Vercel
- Check that Clerk keys are valid and not expired
- Ensure your Clerk organization is properly configured

**Content not appearing**

- Check GitHub Actions logs for any errors
- Verify the directory path specified in the workflow
- Ensure the preview repository exists and is accessible

## Support

For issues related to:

- **Clerk Authentication**: Check [Clerk Documentation](https://clerk.com/docs)
- **GitHub Actions**: Review [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Vercel Deployment**: See [Vercel Documentation](https://vercel.com/docs)
