# Personal Portfolio Website

A playful, highly interactive portfolio website built with React and Vite.

## Features

- 🎨 Modern, clean design with playful animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth scroll animations and micro-interactions
- 🎯 All sections: Hero, Projects, About, Skills, Playground, Testimonials, Contact
- 🌈 Beautiful gradient accents and glassmorphism effects
- ♿ Accessible and SEO-friendly

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Your Information

1. **Name**: Replace `[YOUR NAME]` throughout the components
2. **Contact Info**: Update email and social links in `Contact.jsx` and `Footer.jsx`
3. **Projects**: Edit the projects array in `Projects.jsx`
4. **About**: Update the about section content in `About.jsx`
5. **Skills**: Modify skills in `Skills.jsx`
6. **Testimonials**: Update testimonials in `Testimonials.jsx`

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --accent-primary: #6366f1;  /* Primary accent color */
  --accent-secondary: #8b5cf6; /* Secondary accent */
  --accent-tertiary: #ec4899;  /* Tertiary accent */
}
```

### Fonts

The site uses:
- **Headings**: Space Grotesk (from Google Fonts)
- **Body**: Inter (from Google Fonts)

You can change fonts in `index.html` and update `font-family` in `src/index.css`.

## Project Structure

```
src/
├── components/
│   ├── Navigation.jsx
│   ├── Hero.jsx
│   ├── StatsStrip.jsx
│   ├── Projects.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Playground.jsx
│   ├── Testimonials.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── BackToTop.jsx
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Technologies Used

- React 18
- Vite
- Framer Motion (animations)
- React Icons
- CSS3 (custom styling)

## License

MIT

