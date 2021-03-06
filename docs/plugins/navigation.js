import {forEach} from 'lodash';

export default function() {
  return function(files, metalsmith, done) {
    const categories = {};

    // First we scann all the HTML files to retrieve all the related documents based
    // on the category attribute in the metadata
    forEach(files, (data, path) => {
      if (!path.match(/\.html$/) || data.tocVisibility === false) return;
      const category = data.category || 'other';
      categories[category] = categories[category] || [];
      categories[category].push({
        path,
        title: data.title,
        navWeight: data.navWeight,
        metadata: data,
      });
    });

    for (let categoryName in categories) {
      categories[categoryName] = categories[categoryName].sort((a, b) => {
       if (a.title && b.title && a.navWeight === b.navWeight) {
         return a.title.localeCompare(b.title);
       } else {
         return a.navWeight - b.navWeight;
       }
     });
    }

    // Then we go through all the files again to attach in the navigation attribute
    // all the related documents
    forEach(files, (data, path) => {
      if (!path.match(/\.html$/)) return;
      const category = data.category || 'other';

      data.essentials = categories['Getting started'];
      data.advanced = categories['Advanced'];
      data.examples = categories['Examples'];
      data.components = categories['Components'];

      data.navPath = path;
    });

    done();
  };
}
