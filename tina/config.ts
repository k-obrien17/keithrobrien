import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "projects",
        label: "Projects",
        path: "content/site",
        format: "json",
        match: { include: "projects" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "list",
            label: "Projects",
            list: true,
            ui: {
              itemProps: (item: { name?: string }) => ({ label: item?.name || "Untitled" }),
            },
            fields: [
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "slug", label: "Slug", required: true },
              { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
              { type: "string", name: "stack", label: "Stack", list: true },
              {
                type: "string",
                name: "status",
                label: "Status",
                options: ["active", "maintained", "dormant"],
                required: true,
              },
              { type: "string", name: "url", label: "URL" },
              { type: "string", name: "repo", label: "Repo" },
              { type: "boolean", name: "featured", label: "Featured" },
            ],
          },
        ],
      },
      {
        name: "pageHome",
        label: "Home page",
        path: "content/site",
        format: "json",
        match: { include: "home" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "name", label: "Name (h1)", required: true },
          { type: "string", name: "tagline", label: "Tagline", required: true },
          { type: "string", name: "introPrefix", label: "Intro — before highlight", ui: { component: "textarea" } },
          { type: "string", name: "introHighlight", label: "Intro — highlighted word(s)" },
          { type: "string", name: "introSuffix", label: "Intro — after highlight", ui: { component: "textarea" } },
          { type: "string", name: "secondary", label: "Secondary paragraph", ui: { component: "textarea" } },
          {
            type: "object",
            name: "facets",
            label: "Facets",
            list: true,
            ui: {
              itemProps: (item: { label?: string }) => ({ label: item?.label || "Untitled" }),
            },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "desc", label: "Description", required: true },
              { type: "string", name: "href", label: "Link" },
              { type: "boolean", name: "external", label: "Opens in new tab" },
            ],
          },
        ],
      },
      {
        name: "pageAbout",
        label: "About page",
        path: "content/site",
        format: "json",
        match: { include: "about" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
          { type: "string", name: "newsletters", label: "Newsletters (Markdown)", ui: { component: "textarea" } },
          { type: "string", name: "previously", label: "Previously", ui: { component: "textarea" } },
          { type: "string", name: "outsideOfWork", label: "Outside of work", ui: { component: "textarea" } },
          {
            type: "object",
            name: "links",
            label: "Elsewhere links",
            list: true,
            ui: {
              itemProps: (item: { label?: string }) => ({ label: item?.label || "Untitled" }),
            },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "href", label: "URL", required: true },
            ],
          },
        ],
      },
    ],
  },
});
