# Photography Portfolio Website

Topic: Photography Portfolio Website.

A five-page website with a photo gallery, information about the team, sample photography services and a contact form.

Website: https://eralyy.github.io/photography-midterm/

## Pages and features

- Home: introduction, featured photograph and Bootstrap columns.
- About: project description, team members and a list of features.
- Services: sample session prices in a table with alternating row colours.
- Gallery: six photographs arranged with CSS Grid, captions and photo credits.
- Contact: labelled form fields with required-field and email validation.

All pages have the same Flexbox navigation, logo and footer. The layout changes at 768px and 1200px. Smaller screens show one gallery column, medium screens two, and wide screens three. The Services and Contact columns use Bootstrap's 992px breakpoint.

The external stylesheet includes CSS variables, class and ID selectors, hover and focus states, and relative/absolute positioning for the photograph label. Images below the first visible part of the page use lazy loading.

The contact form is a front-end demonstration. It checks the fields and displays a message. It does not send email or store information. Service prices are examples.

## Technologies

HTML5, CSS3, Bootstrap 5.3.8 and a small JavaScript form handler. Bootstrap CSS, photographs and the Lato font are stored locally.

## Team responsibilities

This is the work allocation for the group. Each member should review their assigned parts and understand the whole website before the individual defence.

| Group member | Assigned contribution |
| --- | --- |
| Aknur Galymzhankyzy | Gallery, CSS styling, photograph selection and credits. |
| Yerali Karkinbayev | Home and About pages, shared navigation, Bootstrap layout and responsive checks. |
| Bissentayev Madiyar | Services page and table, Contact page and form validation. |

## How to open

Open `index.html` in a browser. The local version works without an internet connection. External links need internet access.

## Sources

Sample photographs are from Unsplash, not taken by the group. Individual source links are on the Gallery page. They are used under the [Unsplash License](https://unsplash.com/license).

[Bootstrap](https://getbootstrap.com/) is distributed under the MIT License, included in `bootstrap/LICENSE`.

[Lato](https://github.com/google/fonts/tree/main/ofl/lato) is by Lukasz Dziedzic. Its font licence is included in `fonts/OFL.txt`.
