module.exports = {
  lang: "fr",
  permalink: function (data) {
    // Change (English) /en/blog/my-post URLs to have an implied language code /blog/my-post URLs instead.
    let [_, __, ...stem] = data.page.filePathStem.split("/");
    let path = stem.join("/");
    return stem[stem.length - 1] === "index" ? `${path}.html` : `${path}/index.html`;
  }
}
