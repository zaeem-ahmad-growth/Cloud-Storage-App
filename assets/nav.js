// The tab bar at the top of every page. Each page loads this file right after its <nav class="bar">.
// To add a tab: create tabs/<NN>-<slug>/index.html, then add one line to TABS below (the order here is the order on screen).
// A { section: '<name>' } line starts a named group: it draws a label in the bar, and every tab after it sits under
// that label until the next section line. Tabs listed before the first section line are ungrouped.
(function () {
  var TABS = [
    { slug: '01-aso-playbook', label: 'ASO Playbook' },
    { slug: '02-playstore-metadata', label: 'PlayStore Metadata' },
    { slug: '03-features-comparison', label: 'Features Comparison' },
    { slug: '04-competitors-graphics', label: 'Competitor’s Graphics' },
    { slug: '05-free-100-gb-offer', label: 'Free 100 GB Offer' },
    { section: 'Version 1' },
    { slug: '06-ua-strategy', label: 'UA Strategy' }
  ];
  var RESEARCH = 'https://github.com/zaeem-ahmad-growth/Cloud-Storage-App/tree/main/research';

  var box = document.getElementById('site-tabs');
  if (!box) return;
  var parts = location.pathname.split('/');
  var at = parts.lastIndexOf('tabs');
  var current = at >= 0 ? parts[at + 1] : '';
  // Opened straight from disk (file://), folders do not open their index.html, so link to it by name.
  var suffix = location.protocol === 'file:' ? 'index.html' : '';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  box.innerHTML = TABS.map(function (t) {
    if (t.section) return '<span class="grp">' + esc(t.section) + '</span>';
    return '<a href="../' + t.slug + '/' + suffix + '"' + (t.slug === current ? ' aria-current="page"' : '') + '>' + esc(t.label) + '</a>';
  }).join('') + '<a class="ext" href="' + RESEARCH + '" target="_blank" rel="noopener">Research data ↗</a>';
})();
