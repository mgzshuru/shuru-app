import React from 'react';
import { notFound } from 'next/navigation';
import { getMagazineIssueBySlug } from '@/lib/strapi-client';
import { getMagazineIssueBySlugOptimized, getMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { MagazineReadClient } from '@/app/magazine/[slug]/read/magazine-read-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all magazine issues
export async function generateStaticParams() {
  try {
    const issues = await getMagazineIssuesOptimized();
    if (issues && Array.isArray(issues.data)) {
      return issues.data.map((issue: any) => ({
        slug: issue.slug,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Revalidate every hour
export const revalidate = 3600;

export default async function MagazineReadPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch data on the server side
  let issue: any;
  try {
    issue = await getMagazineIssueBySlugOptimized(slug).catch(() => getMagazineIssueBySlug(slug));
  } catch (error) {
    console.error('Error loading issue:', error);
    notFound();
  }

  if (!issue || !issue.pdf_attachment) {
    notFound();
  }

  const pdfUrl = getStrapiMedia(issue.pdf_attachment.url);

  if (!pdfUrl) {
    notFound();
  }

  return (
    <MagazineReadClient
      pdfUrl={pdfUrl}
      magazineTitle={`${issue.title} - العدد ${issue.issue_number}`}
      magazineSlug={slug}
      downloadUrl={pdfUrl}
    />
  );
}
