# 🚀 Deploy Guide - GitHub Pages

This document provides detailed instructions for deploying the Hevy Report application to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Node.js >= 18 installed

## 🔧 GitHub Pages Configuration

The project is pre-configured for GitHub Pages deployment with:

### 1. GitHub Actions Workflow
- **File**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch
- **Process**: Build → Test → Deploy to GitHub Pages
- **Permissions**: Configured for GitHub Pages deployment

### 2. Vite Configuration
- **Base path**: Automatically set to `/hevy-report/` in production
- **Build output**: `dist/` directory
- **Source maps**: Enabled for debugging

### 3. SPA Routing Support
- **404.html**: Handles client-side routing
- **index.html**: Includes SPA routing script
- **.nojekyll**: Prevents Jekyll processing

## 🚀 Deployment Steps

### Option 1: Fork and Deploy (Recommended)

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/zabaala/hevy-report.git
   cd hevy-report
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **"GitHub Actions"**

4. **Push to trigger deployment**:
   ```bash
   git push origin main
   ```

5. **Access your deployment**:
   - URL: `https://zabaala.github.io/hevy-report/`
   - Check the Actions tab for deployment status

### Option 2: Manual Deployment

1. **Build the project locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service

## 🔍 Troubleshooting

### Common Issues

**1. Blank page after deployment**
- Check if base path is correctly configured in `vite.config.ts`
- Verify GitHub Pages is enabled with "GitHub Actions" source

**2. Routing not working**
- Ensure `404.html` is present in the build output
- Check browser console for JavaScript errors

**3. Build failures**
- Review GitHub Actions logs in the "Actions" tab
- Check for TypeScript errors locally with `npm run build`

**4. Assets not loading**
- Verify base path configuration matches repository name
- Check network tab in browser dev tools

### Debug Commands

```bash
# Test build locally
npm run build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint
```

## 📊 Deployment Status

You can monitor deployment status:

1. **GitHub Actions tab** - Build and deployment logs
2. **Settings → Pages** - Current deployment URL and status
3. **Repository insights** - Traffic and usage statistics

## 🔄 Automatic Updates

The deployment automatically updates when you:
- Push commits to the `main` branch
- Merge pull requests to `main`
- Create releases (if configured)

## 🛠️ Advanced Configuration

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

### Environment Variables

For production-specific configurations:
- Use `import.meta.env.MODE` to detect production
- Configure in `vite.config.ts` or environment files
- Avoid sensitive data in client-side code

## 📝 Notes

- **Build time**: Typically 1-2 minutes
- **Propagation**: Changes may take a few minutes to appear
- **Caching**: GitHub Pages uses CDN caching
- **Limits**: 1GB storage, 100GB bandwidth per month
- **HTTPS**: Automatically enabled for GitHub Pages

## 🆘 Support

If you encounter issues:
1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the project's GitHub Issues
3. Verify your repository settings match the requirements
