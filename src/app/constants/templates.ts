import {
  CONTENT_BLANK,
  CONTENT_BUSINESS_LETTER,
  CONTENT_COVER_LETTER,
  CONTENT_LETTER,
  CONTENT_MARKDOWN,
  CONTENT_PROJECT_PROPOSAL,
  CONTENT_RESUME,
  CONTENT_SOFTWARE_PROPOSAL,
} from "./content";

export type DocumentContentType = "markdown" | "regular";

export const CONTENT_TYPE_MARKDOWN: DocumentContentType = "markdown";
export const CONTENT_TYPE_REGULAR: DocumentContentType = "regular";

export const TEMPLATE_ID_BLANK = "blank";
export const TEMPLATE_ID_MARKDOWN = "markdown";
export const TEMPLATE_ID_BUSINESS_LETTER = "business-letter";
export const TEMPLATE_ID_COVER_LETTER = "cover-letter";
export const TEMPLATE_ID_LETTER = "letter";
export const TEMPLATE_ID_PROJECT_PROPOSAL = "project-proposal";
export const TEMPLATE_ID_RESUME = "resume";
export const TEMPLATE_ID_SOFTWARE_PROPOSAL = "software-proposal";

export const templates = {
  [TEMPLATE_ID_BLANK]: {
    label: "Blank Document",
    imgUrl: "/templates/blank-document.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_BLANK,
  },
  [TEMPLATE_ID_MARKDOWN]: {
    label: "Markdown Document",
    imgUrl: "/templates/blank-markdown.svg",
    contentType: CONTENT_TYPE_MARKDOWN,
    initialContent: CONTENT_MARKDOWN,
  },
  [TEMPLATE_ID_BUSINESS_LETTER]: {
    label: "Business Letter",
    imgUrl: "/templates/business-letter.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_BUSINESS_LETTER,
  },
  [TEMPLATE_ID_COVER_LETTER]: {
    label: "Cover Letter",
    imgUrl: "/templates/cover-letter.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_COVER_LETTER,
  },
  [TEMPLATE_ID_LETTER]: {
    label: "Letter",
    imgUrl: "/templates/letter.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_LETTER,
  },
  [TEMPLATE_ID_PROJECT_PROPOSAL]: {
    label: "Project Proposal",
    imgUrl: "/templates/project-proposal.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_PROJECT_PROPOSAL,
  },
  [TEMPLATE_ID_RESUME]: {
    label: "Resume",
    imgUrl: "/templates/resume.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_RESUME,
  },
  [TEMPLATE_ID_SOFTWARE_PROPOSAL]: {
    label: "Software Proposal",
    imgUrl: "/templates/software-proposal.svg",
    contentType: CONTENT_TYPE_REGULAR,
    initialContent: CONTENT_SOFTWARE_PROPOSAL,
  },
} as const;
