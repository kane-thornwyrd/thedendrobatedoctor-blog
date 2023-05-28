const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({ "./public/": "/" });

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'Europe/Paris', locale: "fr" }).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'Europe/Paris', locale: "fr" }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    const out = array.slice(0, n);
    out.push('…')
    return out;
  });

  eleventyConfig.addFilter("log", (...whatever) => {
    const pass = whatever.length > 1 ? whatever.slice(-1) : false;
    whatever.every(w => console.log(w))
    return pass ? whatever : '';
  });

  eleventyConfig.addFilter("first", (...whatever) => whatever[0][0]);
  eleventyConfig.addFilter("value", (whatever, key) => whatever[key]);

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  });

  eleventyConfig.addFilter("filterURLRegEx", (words, regex) => {
    const reg = new RegExp(regex)
    return (words || []).filter(word => !reg.test(word.url));
  });

  // Customize Markdown library and settings:
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "direct-link",
        symbol: "#",
      }),
      level: [1, 2, 3, 4],
      slugify: eleventyConfig.getFilter("slug")
    });
  });

  // Override @11ty/eleventy-dev-server defaults (used only with --serve)
  eleventyConfig.setServerOptions({
    showVersion: true,
  });

  eleventyConfig.addShortcode("emoji", function (emoji, alt = "") {
    return `<span aria-hidden="true" class="emoji">${emoji}</span>` +
      (alt ? `<span class="sr-only">${alt}</span>` : "");
  });

  eleventyConfig.addShortcode("UTip", () => `<a href="https://utip.io/thedendrobatedoctor">UTip</a>`);
  eleventyConfig.addShortcode("KissKissBankBank", () => `<a href="https://www.kisskissbankbank.com/fr/projects/the-dendrobate-doctor">KissKissBankBank</a>`);
  eleventyConfig.addShortcode("Facebook", () => `<a href="https://www.facebook.com/TheDendrobateDoctor/?ref=blog">la page Facebook</a>`);

  eleventyConfig.addShortcode("img", (src, alt) => {
    return `<img src="${src}" alt="${alt}">`
  }
  );

  eleventyConfig.addShortcode("abbr", (text, meaning) => {
    return `<abbr title="${meaning}">${text}</abbr>`
  }
  );

  eleventyConfig.addPassthroughCopy("public/*.ico");
  eleventyConfig.addPassthroughCopy("public/*.ico");
  eleventyConfig.addPassthroughCopy("fr/blog/*.jpg");
  eleventyConfig.addPassthroughCopy("CNAME");


  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "docs"
    }
  };
};
