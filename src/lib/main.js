import notify from './notify';
import processUrl from './shortener';

const _ = browser.i18n.getMessage;


/** Add context menus and toolbar button. */
// per-page
browser.contextMenus.create({
  id: 'shorten-page',
  title: _('menuitem_label'),
  contexts: ['page']
});

// per-link
browser.contextMenus.create({
  id: 'shorten-link',
  title: _('shorten_link_label'),
  contexts: ['link']
});

// Toolbar button.
browser.browserAction.onClicked.addListener(discoverUrl);


/** Process content menu clicks */
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case 'shorten-page':
    discoverUrl();
    break;
  case 'shorten-link':
    processUrl({
      url: info.linkUrl,
      short: false
    });
    break;
  }
});

/** Listen to keyboard shortcut. */
browser.commands.onCommand.addListener((cmd) => {
  if (cmd === 'shorten-page-url') {
    discoverUrl();
  }
});

/**
 * Execute content script to discover canonical short URL on current tab,
 * then listen to it being returned via message.
 */
function discoverUrl() {
  browser.tabs.executeScript({
    file: '/data/js/find-short-url.js'
  }).catch(e => {
    if (e.message && /Missing host permission for the tab/.test(e.message)) {
      notify(_('error_host_permission'));
    } else {
      throw e;
    }
  });
}
browser.runtime.onMessage.addListener(processUrl);
