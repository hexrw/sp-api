import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Unofficial SP-API Documentation and Resources",
	description: "Unofficial knowledge and resource base for the Amazon Selling Partner API (SP-API). Developer survival guide.",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },

		],

		sidebar: [
			{
				text: "Starting Out",
				items: [
					{ text: "Markdown Examples", link: "/guide/get-started" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/hexrw/sp-api" }],
	},
})
