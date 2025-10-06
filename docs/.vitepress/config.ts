import { defineConfig } from "vitepress"

export default defineConfig({
	title: "Unofficial SP-API Field Guide",
	description: "Community-driven knowledge, SDK docs, and runbooks for the Amazon Selling Partner API.",
	cleanUrls: true,
	lastUpdated: true,
	head: [["meta", { name: "theme-color", content: "#0d9488" }]],
	themeConfig: {
		siteTitle: "SP-API",
		nav: [
			{ text: "Guide", link: "/guide/get-started", activeMatch: "^/guide/" },
			{ text: "SDK", link: "/sdk/", activeMatch: "^/sdk/" },
			{ text: "Reports", link: "/reports/index", activeMatch: "^/reports/" },
			{ text: "Troubleshooting", link: "/troubleshooting/index", activeMatch: "^/troubleshooting/" },
			{ text: "Resources", link: "/resources", activeMatch: "^/resources" },
		],
		sidebar: {
			"/guide/": [
				{
					text: "Guide",
					items: [
						{ text: "Getting Started", link: "/guide/get-started" },
						{ text: "Notes & FAQs", link: "/guide/notes" },
						{ text: "Publishing your Application", link: "/guide/publishing-your-application" },
					],
				},
			],
			"/sdk/": [
				{
					text: "SDK",
					items: [
						{ text: "Overview", link: "/sdk/" },
						{ text: "Installation", link: "/sdk/installation" },
						{ text: "Authentication", link: "/sdk/authentication" },
						{ text: "Usage Examples", link: "/sdk/usage" },
						{ text: "Advanced Guides", link: "/sdk/advanced" },
						{ text: "Testing & Tooling", link: "/sdk/testing" },
					],
				},
			],
			"/reports/": [
				{
					text: "Reports",
					items: [
						{ text: "Overview", link: "/reports/index" },
						{ text: "Registry", link: "/reports/registry" },
						{ text: "Types & Fields", link: "/reports/types" },
						{ text: "Requesting Reports", link: "/reports/requesting-reports" },
					],
				},
			],
			"/troubleshooting/": [
				{
					text: "Troubleshooting",
					items: [
						{ text: "Overview", link: "/troubleshooting/index" },
						{ text: "Authorizations", link: "/troubleshooting/authorizations" },
						{ text: "Rate Limits", link: "/troubleshooting/rate-limits" },
					],
				},
		],
		},
		socialLinks: [{ icon: "github", link: "https://github.com/hexrw/sp-api" }],
		editLink: {
			pattern: "https://github.com/hexrw/sp-api/edit/main/docs/:path",
			text: "Suggest changes",
		},
		footer: {
			message: "Community-maintained guidance for builders on the Amazon SP-API.",
			copyright: "MIT Licensed",
		},
	},
})
