/** Research publication card used on research index and selected works. */
// import moment from 'moment';
// import { Link } from 'gatsby';
// import { navigate } from '@reach/router';
import classnames from 'classnames';
import Img from 'gatsby-image';
import isRelativeUrl from 'is-relative-url';
import React, { useState } from 'react';
import {
  Row, Col, Panel, Button, FlexboxGrid, Divider, Stack,
} from 'rsuite';

import { useSiteMetadata, useWindowSize } from '../../utils/hooks';
import Utils from '../../utils/pageUtils';
import PostTag from '../PostTag';
import Icon from '../Icon';
import ImageModal from '../ImageModal';

import * as style from './researchCard.module.less';

/** Render a publication card with metadata, links, tags, and preview media. */
const ResearchCard = (props) => {
  const {
    data: { node },
    tagsMap,
    enableHighlight = false,
    compact = false,
  } = props;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [width] = useWindowSize();
  const isMobile = width < 768;
  
  const {
    frontmatter: {
      title,
      authors,
      excerpt,
      path,
      date,
      tags,
      venue,
      conference,
      cover,
      links,
      highlight,
    },
  } = node;
  // Check if cover has childImageSharp (processed images) or publicURL (GIFs and other non-processed files)
  const publicURL = cover && cover.publicURL ? cover.publicURL : null;
  const isGif = publicURL && publicURL.toLowerCase().endsWith('.gif');
  const imageMdColumns = isGif ? 10 : 9;
  const imageLgColumns = isGif ? 8 : 8;
  const contentMdColumns = compact ? 24 : 24 - imageMdColumns;
  const contentLgColumns = compact ? 24 : 24 - imageLgColumns;
  // For GIFs, always use publicURL to preserve animation
  // For other images, use childImageSharp if available
  const hasImageSharp = cover && cover.childImageSharp && !isGif;
  const fluid = hasImageSharp ? cover.childImageSharp.fluid : null;
  const largeFluid = hasImageSharp && cover.childImageSharp.large ? cover.childImageSharp.large : fluid;
  
  // Debug: log GIF detection
  // if (isGif) {
  //   console.log('GIF detected:', { publicURL, hasImageSharp, title });
  // }

  const siteMetadata = useSiteMetadata();
  const url = Utils.resolvePageUrl(path);
  // const handleClick = (e) => {
  //   const tagName = e.target.tagName.toLowerCase();
  //   if (tagName !== 'a' && tagName !== 'span' && url) {
  //     window.location.href = Utils.generateFullUrl(siteMetadata, url);
  //     // navigate(url);
  //   }
  // };

  /** Build an external action button from the research link metadata. */
  const generateLink = (link, index) => {
    let href = '#';
    if (link.url) {
      if (isRelativeUrl(link.url)) {
        href = Utils.generateFullUrl(siteMetadata, link.url);
      } else {
        href = link.url;
      }
    }
    
    // Parse icon from name if it starts with an icon format
    let iconElement = null;
    let displayName = link.name;
    
    if (link.icon) {
      // Direct icon specification
      iconElement = <Icon icon={link.icon} fixedWidth style={{ marginRight: '0.25rem' }} />;
    } else if (typeof link.name === 'string') {
      // Auto-detect icons based on link name
      const lowerName = link.name.toLowerCase().trim();
      
      if (lowerName.includes('github')) {
        iconElement = <Icon icon={['fab', 'github']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('twitter') || lowerName.includes('tweet') || lowerName === 'x' || lowerName.includes('x post')) {
        iconElement = <Icon icon={['fab', 'twitter']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName === 'hugging face' || lowerName === 'huggingface' || lowerName === 'hf') {
        // Use a custom emoji or symbol for Hugging Face since FontAwesome doesn't have it
        iconElement = <span style={{ marginRight: '0.25rem', fontSize: '0.9em' }}>🤗</span>;
        displayName = link.name.trim();
      } else if (lowerName === 'arxiv' || lowerName.includes('paper') || lowerName.includes('report')) {
        iconElement = <Icon icon={['fas', 'file-alt']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('blog')) {
        iconElement = <Icon icon={['fas', 'rss']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('code') || lowerName.includes('source')) {
        iconElement = <Icon icon={['fas', 'code']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('demo') || lowerName.includes('website')) {
        iconElement = <Icon icon={['fas', 'external-link-alt']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('slides') || lowerName.includes('presentation')) {
        iconElement = <Icon icon={['fas', 'presentation']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('poster')) {
        iconElement = <Icon icon={['fas', 'image']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('video')) {
        iconElement = <Icon icon={['fas', 'play-circle']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      }
    }
    
    return (
      <Button key={`${displayName}-${index}`} appearance="ghost" href={href} target="_blank" size="xs">
        {iconElement}{displayName}
      </Button>
    );
  };

  /** Render one author token while preserving markdown formatting. */
  const generateAuthor = (author, index) => {
    let markdown = Utils.parseMarkDown(author, true);
    if (index >= 0 && index !== authors.length - 1) {
      markdown += ',&nbsp;';
    }
    return (
      <span key={`${author}-${index}`} className={style.authorName}>
        <span dangerouslySetInnerHTML={{ __html: markdown }} />
      </span>
    );
  };

  let infoLine = [];
  if (date) {
    infoLine = infoLine.concat([
      <div key="date">
        {Utils.formatDate(date)}
      </div>,
    ]);
  }
  if (venue) {
    let markdown = Utils.parseMarkDown(venue, true);
    infoLine = infoLine.concat([
      <div key="venue">
        <span dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>,
    ]);
  }
  if (tags) {
    infoLine = infoLine.concat([
      <Stack wrap key="tags">
        {tags.map(
          (tag) => (tagsMap[tag] ? <PostTag key={`tag-${tag}`} tag={tagsMap[tag]} /> : null),
        )}
      </Stack>,
    ]);
  }

  const excerptHTML = Utils.parseMarkDown(Utils.trimExcerpt(excerpt), true);

  // Image component
  const imageSection = (!compact && (fluid || publicURL)) ? (
    <FlexboxGrid.Item
      as={Col}
      className={style.imageColumn}
      xs={24}
      sm={24}
      md={imageMdColumns}
      lg={imageLgColumns}
    >
      <div
        className={classnames(style.imageWrapper, { [style.animatedPreview]: isGif })}
        onClick={() => setImageModalOpen(true)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setImageModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {fluid ? (
          <Img fluid={fluid} />
        ) : publicURL ? (
          <img
            className={classnames(style.rawPreviewImage, { [style.animatedPreviewImage]: isGif })}
            src={publicURL}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className={style.postCardImg} />
        )}
      </div>
      <ImageModal 
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        fluid={largeFluid}
        publicURL={publicURL}
        title={title}
      />
    </FlexboxGrid.Item>
  ) : null;

  // Content section
  const conferenceHTML = conference ? Utils.parseMarkDown(conference, true) : '';
  const contentSection = (
    <FlexboxGrid.Item as={Col} xs={24} sm={24} md={contentMdColumns} lg={contentLgColumns}>
      <h5><a href={Utils.generateFullUrl(siteMetadata, url)}>{title}</a></h5>
      <FlexboxGrid className={style.authorsRow}>
        {authors ? authors.map(generateAuthor) : null}
      </FlexboxGrid>
      <Stack wrap divider={<Divider vertical className={style.divider} />} style={{ marginTop: '0.5rem'}}>
        {infoLine}
      </Stack>
      <a href={Utils.generateFullUrl(siteMetadata, url)}>
        <p
          className={compact ? style.compactExcerpt : undefined}
          style={{ marginTop: isMobile || compact ? '0.5rem' : '1rem' }}
          dangerouslySetInnerHTML={{ __html: excerptHTML }}
        />
      </a>
      {links && links.length ? (
        <Stack
          wrap
          spacing={6}
          className={style.linksContainer}
          style={{ marginTop: isMobile ? '0.5rem' : '1rem' }}
        >
          {links.map(generateLink) }
        </Stack>
      ) : null}
    </FlexboxGrid.Item>
  );

  return (
    <Panel
      className={classnames(
        style.researchCard,
        {
          [style.highlighted]: highlight && enableHighlight,
          [style.hasConference]: conference,
        },
        'cursor-default',
      )}
      style={{ padding: 0 }}
      // hoverable
      bordered
    >
      {conference ? (
        <span
          className={style.conferenceBadge}
          dangerouslySetInnerHTML={{ __html: conferenceHTML }}
        />
      ) : null}
      <FlexboxGrid gutter={8} align="middle">
        {/* On mobile: content first (title, links), then image below. On desktop: content left, image right */}
        {contentSection}
        {imageSection}
      </FlexboxGrid>
    </Panel>
  );
};

export default ResearchCard;
