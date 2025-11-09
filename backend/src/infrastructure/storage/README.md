# Cloudflare R2 Storage Integration

## Overview

This module provides integration with Cloudflare R2 for file storage. It uses the AWS S3-compatible API to upload and manage files.

## Dependencies

Install the required packages:

```bash
npm install @aws-sdk/client-s3 multer
npm install --save-dev @types/multer
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com  # Optional: Custom domain for public URLs
```

## Configuration

1. **Account ID**: Found in Cloudflare Dashboard → R2 → Overview
2. **Access Key ID & Secret**: Create API tokens in Cloudflare Dashboard → R2 → Manage R2 API Tokens
3. **Bucket Name**: Your R2 bucket name
4. **Public URL** (Optional): If you have a custom domain configured for your R2 bucket

## Usage

The `ICloudflareR2Client` is injected via dependency injection and can be used in services:

```typescript
@inject(INFRASTRUCTURE_TYPES.ICloudflareR2Client)
private readonly cloudflareR2Client: ICloudflareR2Client
```

## File Structure

Files are stored in the following structure:
- `audits/{auditId}/{timestamp}-{filename}` for audit photos
- Custom folders can be specified when uploading

## Error Handling

If configuration is missing, the service will throw an error at startup, preventing the application from running with incomplete configuration.

