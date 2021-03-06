(function() {
// Site-defined *short* URLs.
const short_selectors = 'link[rev=canonical],link[rel=shorturl],link[rel=shortlink]';
// Site-defined *long* URLs.
const long_selectors = 'link[rel=canonical], meta[property="og:url"]';

/** Find short URL in the page */
function findShortUrl() {
  const title = document.querySelector('title').text;
  let short = document.querySelector(short_selectors);
  let link;

  if (short && (link = short.href)) {
    return {
      short: true,
      url: link,
      title: title
    };
  } else {
    // Use canonical URL if it exists, else Facebook OpenGraph or finally, document URL.
    let canonical = document.querySelector(long_selectors);
    link = (canonical && (canonical.href || canonical.content));  // link->href, meta->content
    if (!link) {  // Document URL fallback.
      link = document.location.href;
    }
    return {
      short: false,
      url: link,
      title: title
    };
  }
}

browser.runtime.sendMessage(findShortUrl());

}());
