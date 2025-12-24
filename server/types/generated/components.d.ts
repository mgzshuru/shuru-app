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
    image: Schema.Attribute.Component<'content.image', false> &
      Schema.Attribute.Required;
    logoText: Schema.Attribute.String & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Component<'content.image', false> &
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

export interface ContactAddressItem extends Struct.ComponentSchema {
  collectionName: 'components_contact_address_items';
  info: {
    description: 'Address information with coordinates';
    displayName: 'Address Item';
  };
  attributes: {
    addressLine1: Schema.Attribute.String & Schema.Attribute.Required;
    addressLine2: Schema.Attribute.String;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629'>;
    description: Schema.Attribute.Text;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    officeType: Schema.Attribute.Enumeration<
      ['main', 'branch', 'warehouse', 'other']
    > &
      Schema.Attribute.DefaultTo<'main'>;
    postalCode: Schema.Attribute.String;
    state: Schema.Attribute.String;
  };
}

export interface ContactContactInformation extends Struct.ComponentSchema {
  collectionName: 'components_contact_contact_informations';
  info: {
    description: 'Contact details like email, phone, address, and office hours';
    displayName: 'Contact Information';
  };
  attributes: {
    additionalInfo: Schema.Attribute.Text;
    addresses: Schema.Attribute.Component<'contact.address-item', true>;
    emails: Schema.Attribute.Component<'contact.contact-item', true>;
    officeHours: Schema.Attribute.Component<'contact.office-hours', false>;
    phones: Schema.Attribute.Component<'contact.contact-item', true>;
    socialLinks: Schema.Attribute.Component<'contact.social-link', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644'>;
  };
}

export interface ContactContactItem extends Struct.ComponentSchema {
  collectionName: 'components_contact_contact_items';
  info: {
    description: 'Individual contact item like email or phone';
    displayName: 'Contact Item';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isPublic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_contact_faq_items';
  info: {
    description: 'Individual FAQ question and answer';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      ['general', 'technical', 'billing', 'support', 'partnership', 'other']
    > &
      Schema.Attribute.DefaultTo<'general'>;
    isPublished: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    question: Schema.Attribute.String & Schema.Attribute.Required;
    relatedLinks: Schema.Attribute.JSON;
  };
}

export interface ContactFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_faq_sections';
  info: {
    description: 'Frequently asked questions section for contact page';
    displayName: 'FAQ Section';
  };
  attributes: {
    contactPromptText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0644\u0645 \u062A\u062C\u062F \u0625\u062C\u0627\u0628\u0629 \u0644\u0633\u0624\u0627\u0644\u0643\u061F \u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629'>;
    description: Schema.Attribute.Text;
    faqs: Schema.Attribute.Component<'contact.faq-item', true>;
    showContactPrompt: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629'>;
  };
}

export interface ContactFormSettings extends Struct.ComponentSchema {
  collectionName: 'components_contact_form_settings';
  info: {
    description: 'Contact form configuration and texts';
    displayName: 'Form Settings';
  };
  attributes: {
    allowedFileTypes: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<['.pdf', '.doc', '.docx', '.jpg', '.png']>;
    companyPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0633\u0645 \u0627\u0644\u0634\u0631\u0643\u0629/\u0627\u0644\u0645\u0624\u0633\u0633\u0629'>;
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A *'>;
    enableCaptcha: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    enableFileUpload: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    formDescription: Schema.Attribute.Text;
    formTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629'>;
    loadingText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u062C\u0627\u0631\u064A \u0627\u0644\u0625\u0631\u0633\u0627\u0644...'>;
    maxFileSize: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5>;
    messagePlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u062A\u0643 \u0647\u0646\u0627...'>;
    namePlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 *'>;
    phonePlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641'>;
    privacyPolicyUrl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/privacy'>;
    privacyText: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'\u0628\u0625\u0631\u0633\u0627\u0644 \u0647\u0630\u0647 \u0627\u0644\u0631\u0633\u0627\u0644\u0629\u060C \u0623\u0646\u062A \u062A\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629 \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645'>;
    subjectPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0645\u0648\u0636\u0648\u0639 *'>;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629'>;
    successMessage: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0648\u0627\u0635\u0644\u0643 \u0645\u0639\u0646\u0627. \u0633\u0646\u0631\u062F \u0639\u0644\u0649 \u0631\u0633\u0627\u0644\u062A\u0643 \u0641\u064A \u0623\u0642\u0631\u0628 \u0648\u0642\u062A \u0645\u0645\u0643\u0646.'>;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0628\u0646\u062C\u0627\u062D!'>;
    termsUrl: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/terms'>;
  };
}

export interface ContactHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_hero_sections';
  info: {
    description: 'Contact page hero section with title and description';
    displayName: 'Hero Section';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#000000'>;
    backgroundImage: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0646\u062D\u0646 \u0647\u0646\u0627 \u0644\u0644\u0627\u0633\u062A\u0645\u0627\u0639 \u0625\u0644\u064A\u0643. \u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0644\u0623\u064A \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A \u0623\u0648 \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0623\u0648 \u062A\u0639\u0627\u0648\u0646'>;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#ffffff'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627'>;
  };
}

export interface ContactMapMarker extends Struct.ComponentSchema {
  collectionName: 'components_contact_map_markers';
  info: {
    description: 'Individual marker for the map';
    displayName: 'Map Marker';
  };
  attributes: {
    address: Schema.Attribute.String;
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#000000'>;
    description: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    longitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    website: Schema.Attribute.String;
  };
}

export interface ContactMapSection extends Struct.ComponentSchema {
  collectionName: 'components_contact_map_sections';
  info: {
    description: 'Interactive map section for contact page';
    displayName: 'Map Section';
  };
  attributes: {
    apiKey: Schema.Attribute.String & Schema.Attribute.Private;
    centerLatitude: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<24.7136>;
    centerLongitude: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<46.6753>;
    description: Schema.Attribute.Text;
    height: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<400>;
    mapProvider: Schema.Attribute.Enumeration<
      ['google', 'mapbox', 'openstreetmap']
    > &
      Schema.Attribute.DefaultTo<'google'>;
    mapStyle: Schema.Attribute.Enumeration<
      ['standard', 'satellite', 'hybrid', 'terrain']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
    markers: Schema.Attribute.Component<'contact.map-marker', true>;
    showFullscreenControl: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showZoomControls: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0645\u0648\u0642\u0639\u0646\u0627 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629'>;
    zoomLevel: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<12>;
  };
}

export interface ContactOfficeHours extends Struct.ComponentSchema {
  collectionName: 'components_contact_office_hours';
  info: {
    description: 'Business hours and availability';
    displayName: 'Office Hours';
  };
  attributes: {
    emergencyContact: Schema.Attribute.String;
    holidayMessage: Schema.Attribute.String;
    isOpen24Hours: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    specialHours: Schema.Attribute.Text;
    timezone: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Asia/Riyadh'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0639\u0645\u0644'>;
    weekdayHours: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0623\u062D\u062F - \u0627\u0644\u062E\u0645\u064A\u0633: 9:00 - 17:00'>;
    weekendHours: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u062C\u0645\u0639\u0629 - \u0627\u0644\u0633\u0628\u062A: \u0645\u063A\u0644\u0642'>;
  };
}

export interface ContactOfficeLocation extends Struct.ComponentSchema {
  collectionName: 'components_contact_office_location';
  info: {
    description: 'Individual office location details';
    displayName: 'Office Location';
  };
  attributes: {
    address: Schema.Attribute.Component<'contact.address-item', false>;
    contact: Schema.Attribute.Component<'contact.contact-item', true>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    managers: Schema.Attribute.JSON;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    officeHours: Schema.Attribute.Component<'contact.office-hours', false>;
    services: Schema.Attribute.JSON;
    type: Schema.Attribute.Enumeration<
      ['headquarters', 'branch', 'regional', 'satellite']
    > &
      Schema.Attribute.DefaultTo<'branch'>;
  };
}

export interface ContactOfficeLocations extends Struct.ComponentSchema {
  collectionName: 'components_contact_office_locations';
  info: {
    description: 'Multiple office locations section';
    displayName: 'Office Locations';
  };
  attributes: {
    description: Schema.Attribute.Text;
    offices: Schema.Attribute.Component<'contact.office-location', true>;
    showOnMap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0645\u0648\u0627\u0642\u0639 \u0645\u0643\u0627\u062A\u0628\u0646\u0627'>;
  };
}

export interface ContactSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_contact_social_links';
  info: {
    description: 'Social media links for contact page';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    platform: Schema.Attribute.Enumeration<
      [
        'twitter',
        'facebook',
        'instagram',
        'linkedin',
        'youtube',
        'tiktok',
        'snapchat',
        'whatsapp',
        'telegram',
        'other',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_content_call_to_actions';
  info: {
    description: 'Call to action block with button';
    displayName: 'Call to Action';
  };
  attributes: {
    background_color: Schema.Attribute.String;
    button_text: Schema.Attribute.String & Schema.Attribute.Required;
    button_url: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    open_in_new_tab: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    style: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentCodeBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_code_blocks';
  info: {
    description: 'Code snippet with syntax highlighting';
    displayName: 'Code Block';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    language: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'javascript'>;
    show_line_numbers: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentGallery extends Struct.ComponentSchema {
  collectionName: 'components_content_galleries';
  info: {
    description: 'Image gallery content block';
    displayName: 'Gallery';
  };
  attributes: {
    columns: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'masonry']> &
      Schema.Attribute.DefaultTo<'grid'>;
    title: Schema.Attribute.String;
  };
}

export interface ContentGuest extends Struct.ComponentSchema {
  collectionName: 'components_content_guests';
  info: {
    description: 'Guest information for meetings';
    displayName: 'Guest';
    icon: 'user';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface ContentImage extends Struct.ComponentSchema {
  collectionName: 'components_content_images';
  info: {
    description: 'Image content block with caption';
    displayName: 'Image';
  };
  attributes: {
    alt_text: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    width: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface ContentQuote extends Struct.ComponentSchema {
  collectionName: 'components_content_quotes';
  info: {
    description: 'Quote or blockquote content';
    displayName: 'Quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    author_title: Schema.Attribute.String;
    quote_text: Schema.Attribute.Text & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<
      ['default', 'highlighted', 'pullquote']
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface ContentRichText extends Struct.ComponentSchema {
  collectionName: 'components_content_rich_texts';
  info: {
    description: 'Rich text content block';
    displayName: 'Rich Text';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ContentVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_content_video_embeds';
  info: {
    description: 'Embedded video content';
    displayName: 'Video Embed';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.Text;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    video_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeArticleGridSection extends Struct.ComponentSchema {
  collectionName: 'components_home_article_grid_sections';
  info: {
    description: 'Grid layout section displaying articles with dynamic sidebar content (events, ads, etc.)';
    displayName: 'Article Grid Section';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    backgroundColor: Schema.Attribute.Enumeration<
      ['white', 'gray-50', 'gray-100']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    category: Schema.Attribute.Relation<'oneToOne', 'api::category.category'>;
    gridColumns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    maxArticles: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    sectionSpacing: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    showAuthor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showCategory: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showDate: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showExcerpt: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showSidebar: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    sidebarContent: Schema.Attribute.DynamicZone<['shared.event-card']>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Latest Articles'>;
  };
}

export interface HomeFeaturedCategoriesSection extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_categories_sections';
  info: {
    description: 'Section displaying featured categories with their latest articles';
    displayName: 'Featured Categories Section';
  };
  attributes: {
    articlesPerCategory: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    backgroundStyle: Schema.Attribute.Enumeration<
      ['white', 'gray', 'gradient']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::category.category'
    >;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'list']> &
      Schema.Attribute.DefaultTo<'grid'>;
    maxCategories: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    showArticleCount: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showCategoryDescription: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0645\u0645\u064A\u0632\u0629'>;
  };
}

export interface HomeHeroComplexSection extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_complex_sections';
  info: {
    description: 'Complex hero section with featured article and most read widget';
    displayName: 'Hero Complex Section';
  };
  attributes: {
    featuredArticle: Schema.Attribute.Relation<
      'oneToOne',
      'api::article.article'
    >;
    maxMostReadArticles: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    mostReadArticles: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
    showMostRead: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    useRandomFeaturedArticle: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footer';
  info: {
    description: 'Main footer component with logo, links, and social media';
    displayName: 'Footer';
    icon: 'layout';
  };
  attributes: {
    bottomLinks: Schema.Attribute.Component<
      'shared.footer-link-section',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 0;
        },
        number
      >;
    copyright: Schema.Attribute.Component<'shared.footer-copyright', false> &
      Schema.Attribute.Required;
    logo: Schema.Attribute.Component<'shared.footer-logo', false> &
      Schema.Attribute.Required;
    socialLinks: Schema.Attribute.Component<'shared.social-link', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 15;
          min: 0;
        },
        number
      >;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_header';
  info: {
    description: 'Main site header with logo, navigation, search, and subscription';
    displayName: 'Header';
    icon: 'layout';
  };
  attributes: {
    logo: Schema.Attribute.Component<'shared.header-logo', false> &
      Schema.Attribute.Required;
    navigation: Schema.Attribute.Component<'shared.navigation-menu', false> &
      Schema.Attribute.Required;
  };
}

export interface SharedAdSpace extends Struct.ComponentSchema {
  collectionName: 'components_shared_ad_spaces';
  info: {
    description: 'Advertisement space with customizable dimensions and content';
    displayName: 'Ad Space';
  };
  attributes: {
    altText: Schema.Attribute.String;
    customHtml: Schema.Attribute.Text;
    height: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<250>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    linkTarget: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_blank'>;
    placeholderText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0645\u0633\u0627\u062D\u0629 \u0625\u0639\u0644\u0627\u0646\u064A\u0629'>;
    showPlaceholder: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0625\u0639\u0644\u0627\u0646'>;
    width: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<300>;
  };
}

export interface SharedEventCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_event_cards';
  info: {
    description: 'A promotional card for events with image, title, description and CTA';
    displayName: 'Event Card';
  };
  attributes: {
    ctaLink: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/events'>;
    ctaText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0633\u062C\u0644 \u0627\u0644\u0622\u0646'>;
    dateText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'15-18 \u0633\u0628\u062A\u0645\u0628\u0631 | \u0627\u0644\u0631\u064A\u0627\u0636'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'\u062D\u062F\u062B \u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0644\u0647\u0630\u0627 \u0627\u0644\u0639\u0627\u0645 \u0633\u064A\u062C\u0645\u0639 \u0622\u0644\u0627\u0641 \u0627\u0644\u0635\u0646\u0627\u0639 \u0648\u0627\u0644\u0645\u0628\u062A\u0643\u0631\u064A\u0646 \u0645\u0646 \u062C\u0645\u064A\u0639 \u0623\u0646\u062D\u0627\u0621 \u0627\u0644\u0639\u0627\u0644\u0645'>;
    image: Schema.Attribute.Media<'images'>;
    sectionIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/_public/homepage_icons/events.gif'>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u062D\u0641\u0638 \u0627\u0644\u062A\u0627\u0631\u064A\u062E'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0645\u0647\u0631\u062C\u0627\u0646 \u0634\u064F\u0631\u0648 \u0644\u0644\u0627\u0628\u062A\u0643\u0627\u0631'>;
  };
}

export interface SharedFooterCopyright extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_copyright';
  info: {
    description: 'Copyright information with year and company details';
    displayName: 'Footer Copyright';
    icon: 'information';
  };
  attributes: {
    allRightsReserved: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    companyName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    customText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    showCurrentYear: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    year: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 2100;
          min: 1900;
        },
        number
      >;
  };
}

export interface SharedFooterLinkSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_link_section';
  info: {
    description: 'Grouped links section with title';
    displayName: 'Footer Link Section';
    icon: 'apps';
  };
  attributes: {
    link: Schema.Attribute.Component<'shared.link', false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedFooterLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_logo';
  info: {
    description: 'Logo component for footer with text and images';
    displayName: 'Footer Logo';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    logoImage: Schema.Attribute.Media<'images'>;
    mobileImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedGuidelineItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_guideline_items';
  info: {
    description: 'Individual guideline item for submission guidelines';
    displayName: 'Guideline Item';
    icon: 'bulletList';
  };
  attributes: {
    itemText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface SharedHeaderLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_header_logos';
  info: {
    description: 'Logo component for header with responsive images';
    displayName: 'Header Logo';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Company logo'>;
    logoImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    description: 'Individual footer link with icon support';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface SharedLoginButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_login_buttons';
  info: {
    description: 'Login button for user authentication';
    displayName: 'Login Button';
    icon: 'user';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644'>;
    url: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/login'>;
  };
}

export interface SharedNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_items';
  info: {
    description: 'Individual navigation menu item';
    displayName: 'Navigation Item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    onHeader: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    onSideBar: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavigationMenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_menus';
  info: {
    description: 'Main navigation menu with primary and secondary links';
    displayName: 'Navigation Menu';
    icon: 'apps';
  };
  attributes: {
    primaryMenuItems: Schema.Attribute.Component<
      'shared.navigation-item',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 0;
        },
        number
      >;
  };
}

export interface SharedNewsletterCategory extends Struct.ComponentSchema {
  collectionName: 'components_newsletter_categories';
  info: {
    description: 'Newsletter category with content preview';
    displayName: 'Newsletter Category';
    icon: 'layer';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNewsletterFeature extends Struct.ComponentSchema {
  collectionName: 'components_newsletter_features';
  info: {
    description: 'Feature item for newsletter subscription section';
    displayName: 'Newsletter Feature';
    icon: 'bulletList';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNewsletterHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_newsletter_hero_sections';
  info: {
    description: 'Hero section for newsletter page';
    displayName: 'Newsletter Hero Section';
    icon: 'star';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#ff6b5a'>;
    newsletterCategories: Schema.Attribute.Component<
      'shared.newsletter-category',
      true
    >;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedNewsletterSubscriptionSection
  extends Struct.ComponentSchema {
  collectionName: 'components_newsletter_subscription_sections';
  info: {
    description: 'Subscription form section for newsletter page';
    displayName: 'Newsletter Subscription Section';
    icon: 'envelope';
  };
  attributes: {
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A *'>;
    features: Schema.Attribute.Component<'shared.newsletter-feature', true>;
    formSubtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0623\u062D\u062F\u062B \u0627\u0644\u0623\u062E\u0628\u0627\u0631 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644\u0627\u062A'>;
    formTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0645\u062C\u062A\u0645\u0639\u0646\u0627'>;
    loadingText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u062C\u0627\u0631\u064A \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643...'>;
    namePlaceholder: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0644\u0627\u0633\u0645 *'>;
    privacyPolicyText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629'>;
    privacyPolicyUrl: Schema.Attribute.String;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0634\u062A\u0631\u0643 \u0627\u0644\u0622\u0646'>;
    successMessage: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0634\u0643\u0631\u0627\u064B \u0644\u0643. \u0633\u062A\u0635\u0644\u0643 \u0623\u062D\u062F\u062B \u0627\u0644\u0646\u0634\u0631\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B \u0641\u064A \u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062F.'>;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u062A\u0645 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0628\u0646\u062C\u0627\u062D!'>;
    termsOfServiceText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0634\u0631\u0648\u0637 \u0627\u0644\u062E\u062F\u0645\u0629'>;
    termsOfServiceUrl: Schema.Attribute.String;
  };
}

export interface SharedSecondaryNavigation extends Struct.ComponentSchema {
  collectionName: 'components_shared_secondary_navigations';
  info: {
    description: 'Secondary navigation section with icon and expandable items';
    displayName: 'Secondary Navigation';
    icon: 'grid-nine';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'bg-inherit'>;
    borderColor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'border-transparent'>;
    icon: Schema.Attribute.String;
    isExpandable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    mainUrl: Schema.Attribute.String & Schema.Attribute.Required;
    subItems: Schema.Attribute.Component<'shared.navigation-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 0;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'FastCo Works'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata component for articles';
    displayName: 'SEO Meta';
    icon: 'allergies';
  };
  attributes: {
    meta_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    meta_keywords: Schema.Attribute.String;
    meta_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    og_image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_link';
  info: {
    description: 'Social media link with platform-specific styling';
    displayName: 'Social Link';
    icon: 'connector';
  };
  attributes: {
    link: Schema.Attribute.Component<'shared.link', false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'x',
        'instagram',
        'linkedin',
        'youtube',
        'tiktok',
        'discord',
        'github',
        'telegram',
        'whatsapp',
        'pinterest',
        'snapchat',
        'reddit',
        'custom',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedSubscriptionButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_subscription_buttons';
  info: {
    description: 'Call-to-action subscription button';
    displayName: 'Subscription Button';
    icon: 'cursor';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'\u0627\u0634\u062A\u0631\u0643 \u0627\u0644\u0622\u0646'>;
    url: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/subscribe'>;
  };
}

export interface SharedSuccessStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_success_steps';
  info: {
    description: 'Next step item for success page';
    displayName: 'Success Step';
    icon: 'arrowRight';
  };
  attributes: {
    stepText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
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
      'contact.address-item': ContactAddressItem;
      'contact.contact-information': ContactContactInformation;
      'contact.contact-item': ContactContactItem;
      'contact.faq-item': ContactFaqItem;
      'contact.faq-section': ContactFaqSection;
      'contact.form-settings': ContactFormSettings;
      'contact.hero-section': ContactHeroSection;
      'contact.map-marker': ContactMapMarker;
      'contact.map-section': ContactMapSection;
      'contact.office-hours': ContactOfficeHours;
      'contact.office-location': ContactOfficeLocation;
      'contact.office-locations': ContactOfficeLocations;
      'contact.social-link': ContactSocialLink;
      'content.call-to-action': ContentCallToAction;
      'content.code-block': ContentCodeBlock;
      'content.gallery': ContentGallery;
      'content.guest': ContentGuest;
      'content.image': ContentImage;
      'content.quote': ContentQuote;
      'content.rich-text': ContentRichText;
      'content.video-embed': ContentVideoEmbed;
      'home.article-grid-section': HomeArticleGridSection;
      'home.featured-categories-section': HomeFeaturedCategoriesSection;
      'home.hero-complex-section': HomeHeroComplexSection;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'shared.ad-space': SharedAdSpace;
      'shared.event-card': SharedEventCard;
      'shared.footer-copyright': SharedFooterCopyright;
      'shared.footer-link-section': SharedFooterLinkSection;
      'shared.footer-logo': SharedFooterLogo;
      'shared.guideline-item': SharedGuidelineItem;
      'shared.header-logo': SharedHeaderLogo;
      'shared.link': SharedLink;
      'shared.login-button': SharedLoginButton;
      'shared.navigation-item': SharedNavigationItem;
      'shared.navigation-menu': SharedNavigationMenu;
      'shared.newsletter-category': SharedNewsletterCategory;
      'shared.newsletter-feature': SharedNewsletterFeature;
      'shared.newsletter-hero-section': SharedNewsletterHeroSection;
      'shared.newsletter-subscription-section': SharedNewsletterSubscriptionSection;
      'shared.secondary-navigation': SharedSecondaryNavigation;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.subscription-button': SharedSubscriptionButton;
      'shared.success-step': SharedSuccessStep;
    }
  }
}
