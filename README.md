# Photography Portfolio Website

Web Technologies midterm group project. A simple website with photographs, sample services and a contact form.

Website: https://eralyy.github.io/photography-midterm/

## Pages

- Home: introduction and three Bootstrap columns.
- About: project description and group members.
- Services: a table of sample prices and a list of services.
- Gallery: three photographs with captions and source links.
- Contact: an HTML form with required fields and email validation.

## Technologies and features

HTML5, external CSS, Bootstrap 5.3.8 and Roboto from Google Fonts. No JavaScript.

The header uses Flexbox. The gallery uses CSS Grid: one column below 768px, two from 768px, and three from 1200px. The Home page uses Bootstrap columns at the same breakpoints.

CSS includes three variables, class and ID selectors, hover and focus states, alternating table rows, and relative/absolute positioning for photo captions. Gallery images use lazy loading.

The form uses browser validation. When valid, it returns to the Contact form. The inputs have no name attributes, so their values are not included in the URL. There is no message delivery or storage.

## Team responsibilities

Assigned work for each member:

| Member | Responsibility |
| --- | --- |
| Aknur Galymzhankyzy | Gallery, photographs, source links and CSS. |
| Yerali Karkinbayev | Home, About, navigation, Bootstrap and responsive layout. |
| Bissentayev Madiyar | Services, price table and HTML Contact form. |

## How to open

Open `index.html` in a browser. Google Fonts needs internet access; without it, the site uses Arial. Bootstrap and photographs are stored in the project.

## Sources

The photographs are sample images from [Unsplash](https://unsplash.com/license), not photos taken by our group. Authors are linked on the Gallery page.

Bootstrap's MIT licence is included in `bootstrap/LICENSE`.
