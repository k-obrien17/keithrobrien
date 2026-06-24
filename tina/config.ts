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
    ],
  },
});
