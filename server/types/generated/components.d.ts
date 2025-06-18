import type { Schema, Struct } from '@strapi/strapi';

export interface ComingSoonBlockConfig extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_block_config';
  info: {
    displayName: 'Block Configuration';
    icon: 'settings';
  };
  options: {
    collapsed: false;
    collapsible: true;
  };
  attributes: {
    blockId: Schema.Attribute.String & Schema.Attribute.Required;
    blockName: Schema.Attribute.String & Schema.Attribute.Required;
    customClasses: Schema.Attribute.Text;
    customStyles: Schema.Attribute.JSON;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ComingSoonCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_cta_button';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor-pointer';
  };
  attributes: {
    target: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface ComingSoonFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_feature_item';
  info: {
    displayName: 'Feature Item';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonFeaturesGrid extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_features_grid';
  info: {
    displayName: 'Features Grid';
    icon: 'grid';
  };
  attributes: {
    mainFeature: Schema.Attribute.Component<'coming-soon.main-feature', false> &
      Schema.Attribute.Required;
    specialties: Schema.Attribute.Component<
      'coming-soon.specialties-section',
      false
    > &
      Schema.Attribute.Required;
    stats: Schema.Attribute.Component<'coming-soon.stats-section', false> &
      Schema.Attribute.Required;
  };
}

export interface ComingSoonFooter extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_footer';
  info: {
    displayName: 'Footer';
    icon: 'footer';
  };
  attributes: {
    bottomLinks: Schema.Attribute.Component<'coming-soon.footer-link', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    copyright_text: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Component<'coming-soon.footer-logo', false> &
      Schema.Attribute.Required;
    socialMedia: Schema.Attribute.Component<'coming-soon.social-link', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
  };
}

export interface ComingSoonFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_footer_link';
  info: {
    displayName: 'Footer Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonFooterLogo extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_footer_logo';
  info: {
    displayName: 'Footer Logo';
    icon: 'image';
  };
  attributes: {
    image: Schema.Attribute.Component<'shared.media', false> &
      Schema.Attribute.Required;
    logoText: Schema.Attribute.String & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Component<'shared.media', false> &
      Schema.Attribute.Required;
  };
}

export interface ComingSoonHero extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_hero';
  info: {
    displayName: 'Hero';
    icon: 'star';
  };
  attributes: {
    cta: Schema.Attribute.Component<'coming-soon.cta-button', false> &
      Schema.Attribute.Required;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    logo: Schema.Attribute.Component<'shared.media', false> &
      Schema.Attribute.Required;
    stats: Schema.Attribute.Component<'coming-soon.stat-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonMainFeature extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_main_feature';
  info: {
    displayName: 'Main Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    features: Schema.Attribute.Component<'coming-soon.feature-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_newsletter';
  info: {
    displayName: 'Newsletter';
    icon: 'mail';
  };
  attributes: {
    form: Schema.Attribute.Component<'coming-soon.newsletter-form', false> &
      Schema.Attribute.Required;
    header: Schema.Attribute.Component<'coming-soon.section-header', false> &
      Schema.Attribute.Required;
    messages: Schema.Attribute.Component<
      'coming-soon.newsletter-messages',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface ComingSoonNewsletterForm extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_newsletter_form';
  info: {
    displayName: 'Newsletter Form';
    icon: 'form';
  };
  attributes: {
    emailPlaceholder: Schema.Attribute.String & Schema.Attribute.Required;
    submitButton: Schema.Attribute.Component<
      'coming-soon.submit-button',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface ComingSoonNewsletterMessages extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_newsletter_messages';
  info: {
    displayName: 'Newsletter Messages';
    icon: 'message-circle';
  };
  attributes: {
    privacy: Schema.Attribute.Text & Schema.Attribute.Required;
    success: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_section_header';
  info: {
    displayName: 'Section Header';
    icon: 'heading';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_social_link';
  info: {
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonSpecialtiesSection extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_specialties_section';
  info: {
    displayName: 'Specialties Section';
    icon: 'tag';
  };
  attributes: {
    items: Schema.Attribute.JSON & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonStatItem extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_stat_item';
  info: {
    displayName: 'Stat Item';
    icon: 'chart-line';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonStatsSection extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_stats_section';
  info: {
    displayName: 'Stats Section';
    icon: 'chart-bar';
  };
  attributes: {
    items: Schema.Attribute.Component<'coming-soon.stat-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonSubmitButton extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_submit_button';
  info: {
    displayName: 'Submit Button';
    icon: 'cursor-pointer';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonTeam extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_team';
  info: {
    displayName: 'Team';
    icon: 'users';
  };
  attributes: {
    header: Schema.Attribute.Component<'coming-soon.section-header', false> &
      Schema.Attribute.Required;
    teams: Schema.Attribute.Component<'coming-soon.team-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
  };
}

export interface ComingSoonTeamItem extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_team_item';
  info: {
    displayName: 'Team Item';
    icon: 'user';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonTimeline extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_timeline';
  info: {
    displayName: 'Timeline';
    icon: 'clock';
  };
  attributes: {
    header: Schema.Attribute.Component<'coming-soon.section-header', false> &
      Schema.Attribute.Required;
    phases: Schema.Attribute.Component<'coming-soon.timeline-phase', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
  };
}

export interface ComingSoonTimelinePhase extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_timeline_phase';
  info: {
    displayName: 'Timeline Phase';
    icon: 'circle';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    isCurrent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    phase: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComingSoonWhy extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_why';
  info: {
    displayName: 'Why';
    icon: 'help-circle';
  };
  attributes: {
    features: Schema.Attribute.Component<'coming-soon.why-feature', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    header: Schema.Attribute.Component<'coming-soon.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface ComingSoonWhyFeature extends Struct.ComponentSchema {
  collectionName: 'components_coming_soon_why_feature';
  info: {
    displayName: 'Why Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'coming-soon.block-config': ComingSoonBlockConfig;
      'coming-soon.cta-button': ComingSoonCtaButton;
      'coming-soon.feature-item': ComingSoonFeatureItem;
      'coming-soon.features-grid': ComingSoonFeaturesGrid;
      'coming-soon.footer': ComingSoonFooter;
      'coming-soon.footer-link': ComingSoonFooterLink;
      'coming-soon.footer-logo': ComingSoonFooterLogo;
      'coming-soon.hero': ComingSoonHero;
      'coming-soon.main-feature': ComingSoonMainFeature;
      'coming-soon.newsletter': ComingSoonNewsletter;
      'coming-soon.newsletter-form': ComingSoonNewsletterForm;
      'coming-soon.newsletter-messages': ComingSoonNewsletterMessages;
      'coming-soon.section-header': ComingSoonSectionHeader;
      'coming-soon.social-link': ComingSoonSocialLink;
      'coming-soon.specialties-section': ComingSoonSpecialtiesSection;
      'coming-soon.stat-item': ComingSoonStatItem;
      'coming-soon.stats-section': ComingSoonStatsSection;
      'coming-soon.submit-button': ComingSoonSubmitButton;
      'coming-soon.team': ComingSoonTeam;
      'coming-soon.team-item': ComingSoonTeamItem;
      'coming-soon.timeline': ComingSoonTimeline;
      'coming-soon.timeline-phase': ComingSoonTimelinePhase;
      'coming-soon.why': ComingSoonWhy;
      'coming-soon.why-feature': ComingSoonWhyFeature;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
