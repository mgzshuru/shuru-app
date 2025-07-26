import React from 'react';
import { Hero } from '@/components/blocks/coming-soon/hero';
import { FeaturesGrid } from '@/components/blocks/coming-soon/features-grid';
import { Team } from '@/components/blocks/coming-soon/team';
import { Newsletter } from '@/components/blocks/coming-soon/newsletter';
import { Timeline } from '@/components/blocks/coming-soon/timeline';
import { Why } from '@/components/blocks/coming-soon/why';
import { Footer } from '@/components/blocks/coming-soon/footer';
import { getStrapiURL } from '@/lib/utils';
import { getStrapiMedia } from '@/components/custom/strapi-image';

export interface ComingSoonBlock {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface ComingSoonData {
  id: number;
  blocks: ComingSoonBlock[];
  seo: any;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const renderComingSoonBlock = (block: ComingSoonBlock) => {
  // Generate a unique key for each block
  const uniqueKey = `${block.__component}-${block.id}`;
  switch (block.__component) {
    case 'coming-soon.hero': {
      // Map all required HeroData fields explicitly
      const heroData = {
        title: block.title || '',
        subtitle: block.subtitle || '',
        description: block.description || '',
        stats: block.stats || [],
        cta: block.cta || { text: '', target: '' },
      };
      return <Hero key={uniqueKey} data={heroData} />;
    }
    case 'coming-soon.features-grid': {
      const featuresGridData = {
        mainFeature: {
          label: block.mainFeature?.label || '',
          title: block.mainFeature?.title || '',
          description: block.mainFeature?.description || '',
          features: Array.isArray(block.mainFeature?.features) ? block.mainFeature.features : [],
        },
        stats: {
          label: block.stats?.label || '',
          items: Array.isArray(block.stats?.items) ? block.stats.items : (Array.isArray(block.stats) ? block.stats : []),
        },
        specialties: {
          label: block.specialties?.label || '',
          items: Array.isArray(block.specialties?.items) ? block.specialties.items : (Array.isArray(block.specialties) ? block.specialties : []),
        },
      };
      return <FeaturesGrid key={uniqueKey} data={featuresGridData} />;
    }
    case 'coming-soon.team': {
      const teamData = {
        ...block,
        header: block.header || { label: '', title: '', description: '' },
        teams: block.teams || [],
      };
      return <Team key={uniqueKey} data={teamData} />;
    }
    case 'coming-soon.newsletter': {
      const newsletterData = {
        header: block.header || { label: '', title: '', description: '' },
        form: {
          emailPlaceholder: block.form?.emailPlaceholder || '',
          submitButton: {
            text: block.form?.submitButton?.text || '',
          },
        },
        messages: {
          success: block.messages?.success || '',
          privacy: block.messages?.privacy || '',
        },
      };
      return <Newsletter key={uniqueKey} data={newsletterData} />;
    }
    case 'coming-soon.timeline': {
      const timelineData = {
        ...block,
        header: block.header || { label: '', title: '', description: '' },
        phases: block.phases || [],
      };
      return <Timeline key={uniqueKey} data={timelineData} />;
    }
    case 'coming-soon.why': {
      const whyData = {
        ...block,
        header: block.header || { label: '', title: '', description: '' },
        features: block.features || [],
      };
      return <Why key={uniqueKey} data={whyData} />;
    }
    case 'coming-soon.footer': {
      // Process footer logo URLs like hero logo
      const processedLogo = block.logo ? {
        ...block.logo,
        image: block.logo.image ? {
          ...block.logo.image,
          src: getStrapiMedia(block.logo.image?.file?.url) || block.logo.image?.src,
        } : null,
        mobileImage: block.logo.mobileImage ? {
          ...block.logo.mobileImage,
          src: getStrapiMedia(block.logo.mobileImage?.file?.url) || block.logo.mobileImage?.src,
        } : null,
      } : null;
      return (
        <Footer
          key={uniqueKey}
          copyright_text={block.copyright_text}
          logo={processedLogo}
          socialMedia={block.socialMedia}
          bottomLinks={block.bottomLinks}
        />
      );
    }
    default:
      console.warn(`Unknown block component: ${block.__component}`);
      return null;
  }
};

export const ComingSoonBlocksRenderer: React.FC<{ data: ComingSoonData }> = ({ data }) => {
  if (!data?.blocks) {
    return <div>No blocks found</div>;
  }

  return (
    <div className="coming-soon-page">
      {data.blocks.map((block) => renderComingSoonBlock(block))}
    </div>
  );
};

// Helper function to fetch coming soon data
export const fetchComingSoonData = async (): Promise<ComingSoonData> => {
  const baseUrl = getStrapiURL();
  // Deeply populate all blocks and seo
  const url = `${baseUrl}/api/coming-soon?populate[blocks][populate]=*&populate[seo][populate]=*&populate[blocks][on][coming-soon.hero][populate][stats][populate]=*&populate[blocks][on][coming-soon.hero][populate][cta][populate]=*&populate[blocks][on][coming-soon.features-grid][populate][mainFeature][populate][features][populate]=*&populate[blocks][on][coming-soon.features-grid][populate][stats][populate][items][populate]=*&populate[blocks][on][coming-soon.features-grid][populate][specialties][populate]=*&populate[blocks][on][coming-soon.team][populate][header][populate]=*&populate[blocks][on][coming-soon.team][populate][teams][populate]=*&populate[blocks][on][coming-soon.newsletter][populate][header][populate]=*&populate[blocks][on][coming-soon.newsletter][populate][form][populate][submitButton][populate]=*&populate[blocks][on][coming-soon.newsletter][populate][messages][populate]=*&populate[blocks][on][coming-soon.timeline][populate][header][populate]=*&populate[blocks][on][coming-soon.timeline][populate][phases][populate]=*&populate[blocks][on][coming-soon.why][populate][header][populate]=*&populate[blocks][on][coming-soon.why][populate][features][populate]=*&populate[blocks][on][coming-soon.footer][populate][logo][populate][image][populate]=*&populate[blocks][on][coming-soon.footer][populate][logo][populate][mobileImage][populate]=*&populate[blocks][on][coming-soon.footer][populate][socialMedia][populate]=*&populate[blocks][on][coming-soon.footer][populate][bottomLinks][populate]=*`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Enable static generation with revalidation
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch coming soon data');
  }

  const json = await response.json();
  // Strapi returns { data: {...}, meta: {...} }
  const data = json.data;
  // Adapt to ComingSoonData shape
  return {
    id: data.id,
    blocks: data.blocks,
    seo: data.seo,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// Helper function to get block by type
export const getBlockByType = (blocks: ComingSoonBlock[], componentType: string) => {
  return blocks.find(block => block.__component === componentType);
};

// Helper function to get multiple blocks by type
export const getBlocksByType = (blocks: ComingSoonBlock[], componentType: string) => {
  return blocks.filter(block => block.__component === componentType);
};

// Helper function to check if block exists
export const hasBlock = (blocks: ComingSoonBlock[], componentType: string) => {
  return blocks.some(block => block.__component === componentType);
};