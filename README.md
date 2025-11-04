# PinPhoto - Pinterest-like Image Sharing System

A React-based image sharing application similar to Pinterest with a fake backend using json-server.

## Features

- **Home Page (Feed)**
  - Masonry grid layout for images
  - Real-time search functionality (searches both image titles and descriptions)
  - Category filtering (Travel, Nature, Wildlife, Urban, Food, Fashion, Art, Technology)
  - User information on each image card
  - Like and comment counts

- **Image Detail Page**
  - Full image view
  - Complete image information (title, description)
  - User details (avatar, username, email)
  - View statistics (likes, comments, upload date)
  - Comment section with ability to add new comments
  - Action buttons (Like, Save, Share)

- **Backend**
  - JSON-based database with multiple resources
  - Mock users, images, categories, comments
  - RESTful API via json-server

## Project Structure

```
image-sharing-system/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.js
│   │   ├── CategoryFilter.js
│   │   ├── ImageCard.js
│   │   ├── ImageGrid.js
│   │   └── LoadingSpinner.js
│   ├── pages/               # Page components
│   │   ├── Home.js
│   │   └── ImageDetail.js
│   ├── styles/              # CSS files
│   │   ├── Header.css
│   │   ├── CategoryFilter.css
│   │   ├── ImageCard.css
│   │   ├── ImageGrid.css
│   │   ├── LoadingSpinner.css
│   │   ├── Home.css
│   │   └── ImageDetail.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
├── database.json            # Mock database
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development environment (both frontend and backend):
```bash
npm run dev
```

This command runs:
- **Frontend**: React app on `http://localhost:3000`
- **Backend**: JSON Server API on `http://localhost:5000`

### Alternative: Run separately

**Frontend only:**
```bash
npm start
```

**Backend only (in a separate terminal):**
```bash
npm run server
```

## API Endpoints

The json-server provides the following endpoints:

- `GET /pictures` - Get all images
- `GET /pictures/:id` - Get image by ID
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `GET /categories` - Get all categories
- `GET /comments` - Get all comments
- `GET /comments?picture_id=:id` - Get comments for a specific image

## Component Structure

### Header Component
- Search bar with real-time search functionality
- Sticky header with gradient background

### CategoryFilter Component
- Horizontal scrollable category buttons
- Active state highlighting
- Category icons and names

### ImageCard Component
- Image preview with hover effects
- User information
- Like and comment counts
- Links to image detail page

### ImageGrid Component
- Responsive masonry grid layout
- Automatically adjusts columns based on screen size
- No results message

### Home Page
- Integrates Header, CategoryFilter, and ImageGrid
- Manages search and filter state
- Fetches data from JSON server

### ImageDetail Page
- Full image view
- User details section
- Comments section
- Action buttons
- Back to home navigation

## Styling

The application uses CSS Grid for the image layout, providing:
- **Desktop**: 4-6 columns
- **Tablet**: 2-3 columns
- **Mobile**: 2 columns
- Responsive padding and gap

Features include:
- Smooth transitions and hover effects
- Gradient backgrounds
- Custom scrollbar styling
- Mobile-first approach

## Data Structure

### Picture Object
```json
{
  "id": 1,
  "user_id": 2,
  "title": "Image Title",
  "description": "Image description",
  "image_url": "https://...",
  "category_id": 1,
  "visibility": "public",
  "is_hidden": false,
  "upload_date": "2024-10-15T18:30:00Z",
  "likes_count": 45,
  "comments_count": 8
}
```

### Category Object
```json
{
  "id": 1,
  "name": "Travel",
  "icon": "✈️"
}
```

### User Object
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "avatar_url": "https://...",
  "role": "user"
}
```

### Comment Object
```json
{
  "id": 1,
  "picture_id": 1,
  "user_id": 2,
  "comment_text": "Great photo!",
  "commented_at": "2024-10-15T19:15:00Z"
}
```

## Key Features Implementation

### Search Functionality
- Searches both image title and description
- Real-time filtering as user types
- Case-insensitive

### Category Filter
- Displays 8 categories with icons
- Can select "All" to show all images
- Combines with search filter

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1200px
- Adapts layout, font sizes, and spacing

## Future Enhancements

- User authentication
- Like/Unlike functionality
- Save to collections
- User profiles
- Follow users
- Direct messaging
- Image upload
- Advanced filters (date, popularity)
- Infinite scroll

## Technologies Used

- **Frontend**: React 19
- **Routing**: React Router v6
- **Backend**: json-server
- **Styling**: CSS3 with Flexbox and Grid
- **HTTP Client**: Fetch API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License
