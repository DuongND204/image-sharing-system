# 📚 Component Documentation

## Overview
Detailed documentation for all components and pages in the PinPhoto application.

---

## Components

### 1. Header Component
**File**: `src/components/Header.js`

**Purpose**: Navigation bar with logo and search functionality

**Props**:
- `searchQuery` (string) - Current search input value
- `onSearchChange` (function) - Callback when search input changes

**Features**:
- Sticky positioning (stays at top while scrolling)
- Gradient background (purple/blue)
- Responsive search bar
- White text on colored background

**Usage**:
```jsx
<Header 
  searchQuery={searchQuery} 
  onSearchChange={setSearchQuery} 
/>
```

**Styling**: `src/styles/Header.css`
- Max width: 1400px
- Padding: 1rem
- Sticky position with z-index: 100
- Mobile responsive

---

### 2. CategoryFilter Component
**File**: `src/components/CategoryFilter.js`

**Purpose**: Horizontally scrollable category filter buttons

**Props**:
- `categories` (array) - Array of category objects
- `selectedCategory` (number|null) - Currently selected category ID
- `onCategoryChange` (function) - Callback when category changes

**Features**:
- Horizontal scroll
- Active state styling
- Category icons and names
- "All" button to clear filter
- Smooth transitions

**Category Object Structure**:
```json
{
  "id": 1,
  "name": "Travel",
  "icon": "✈️"
}
```

**Usage**:
```jsx
<CategoryFilter 
  categories={categories} 
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

**Styling**: `src/styles/CategoryFilter.css`
- Horizontal scroll with custom scrollbar
- Active button has purple gradient
- Hover effects

---

### 3. ImageCard Component
**File**: `src/components/ImageCard.js`

**Purpose**: Individual image card display in grid

**Props**:
- `image` (object) - Image data object
- `user` (object) - User data object (optional)

**Image Object Structure**:
```json
{
  "id": 1,
  "title": "Image Title",
  "description": "Description",
  "image_url": "https://...",
  "likes_count": 45,
  "comments_count": 8
}
```

**Features**:
- Hover effects (lift and scale)
- Image overlay with title on hover
- User avatar and username
- Stats display (likes, comments)
- Link to image detail page

**Usage**:
```jsx
<ImageCard 
  image={imageData} 
  user={userData}
/>
```

**Styling**: `src/styles/ImageCard.css`
- Aspect ratio: 1 (square)
- Hover animations
- Image overlay on hover

---

### 4. ImageGrid Component
**File**: `src/components/ImageGrid.js`

**Purpose**: Responsive grid container for images

**Props**:
- `images` (array) - Array of image objects
- `users` (array) - Array of user objects

**Features**:
- Responsive CSS Grid
- Auto-fitting columns
- Automatic user matching
- No results message

**Responsive Columns**:
- Desktop (1200px+): 4-6 columns (250px min)
- Tablet (768px-1199px): 2-3 columns (200px min)
- Mobile (480px-767px): 2 columns (150px min)
- Small Mobile (<480px): 2 columns

**Usage**:
```jsx
<ImageGrid 
  images={filteredImages}
  users={users}
/>
```

**Styling**: `src/styles/ImageGrid.css`
- CSS Grid layout
- Auto-fill with minmax sizing
- Gap: 2rem (desktop), 1rem (mobile)

---

### 5. LoadingSpinner Component
**File**: `src/components/LoadingSpinner.js`

**Purpose**: Loading indicator while fetching data

**Props**: None

**Features**:
- Spinning animation
- Loading text
- Centered display

**Usage**:
```jsx
{loading ? <LoadingSpinner /> : <ImageGrid ... />}
```

**Styling**: `src/styles/LoadingSpinner.css`
- Border-based spinner animation
- Purple gradient color
- 1s rotation cycle

---

## Pages

### 1. Home Page
**File**: `src/pages/Home.js`

**Purpose**: Main feed page displaying images with search and filter

**State Management**:
```jsx
- images: []          // All images
- users: []           // All users
- categories: []      // All categories
- loading: true       // Loading state
- searchQuery: ''     // Current search
- selectedCategory: null // Selected category
```

**Features**:
- Fetch data on mount
- Real-time search across title and description
- Category filtering
- Combines search + filter
- Shows loading spinner

**Data Fetching**:
```
useEffect(() => {
  Promise.all([
    fetch('http://localhost:5000/pictures'),
    fetch('http://localhost:5000/users'),
    fetch('http://localhost:5000/categories')
  ])
})
```

**Filter Logic**:
```jsx
const filteredImages = images.filter((image) => {
  const matchesSearch = image.title.includes(searchQuery) || 
                        image.description.includes(searchQuery);
  const matchesCategory = selectedCategory === null || 
                          image.category_id === selectedCategory;
  return matchesSearch && matchesCategory;
});
```

**Component Tree**:
```
Home
├── Header
├── CategoryFilter
└── Loading or ImageGrid
    └── ImageCard (multiple)
```

**Styling**: `src/styles/Home.css`
- Background: #f8f9fa
- Min height: 100vh

---

### 2. ImageDetail Page
**File**: `src/pages/ImageDetail.js`

**Purpose**: Full-page view of a single image with details

**Route**: `/image/:id`

**State Management**:
```jsx
- image: null         // Image data
- user: null          // User data
- comments: []        // Comments array
- loading: true       // Loading state
- commentText: ''     // New comment input
```

**Features**:
- Fetch image details
- Fetch user info
- Fetch related comments
- Display full image
- Show user profile
- Display statistics
- Add comment functionality
- Action buttons
- Back navigation

**Data Fetching**:
```
useEffect(() => {
  Promise.all([
    fetch(`/pictures/:id`),
    fetch(`/users/:userId`),
    fetch(`/comments?picture_id=:id`)
  ])
})
```

**Comment Object Structure**:
```json
{
  "id": 1,
  "picture_id": 1,
  "user_id": 1,
  "comment_text": "Great photo!",
  "commented_at": "2024-10-15T19:15:00Z"
}
```

**Add Comment Flow**:
```jsx
const handleAddComment = () => {
  if (commentText.trim()) {
    const newComment = {
      id: comments.length + 1,
      picture_id: image.id,
      user_id: 1,
      comment_text: commentText,
      commented_at: new Date().toISOString()
    };
    setComments([...comments, newComment]);
    setCommentText('');
  }
};
```

**Layout Sections**:
1. **Image Section** - Large image display
2. **Info Section**
   - Header (title + user)
   - Description
   - Statistics
   - Action buttons
   - Comments section

**Styling**: `src/styles/ImageDetail.css`
- Two-column layout (desktop)
- Single column (mobile)
- Responsive font sizes

---

## Props Flow Diagram

```
App.js
├── Home.js
│   ├── Header
│   │   ├── searchQuery (prop)
│   │   └── onSearchChange (callback)
│   ├── CategoryFilter
│   │   ├── categories (prop)
│   │   ├── selectedCategory (prop)
│   │   └── onCategoryChange (callback)
│   └── ImageGrid
│       ├── images (prop)
│       ├── users (prop)
│       └── ImageCard
│           ├── image (prop)
│           └── user (prop)
└── ImageDetail.js
    └── (no props - uses URL params with useParams)
```

---

## State Management Flow

### Home Page
```
Component Mounts
    ↓
useEffect: Fetch 3 endpoints
    ↓
Set: images, users, categories
    ↓
Render with data
    ↓
User types in search
    ↓
onSearchChange triggered
    ↓
Filter images in real-time
    ↓
Re-render ImageGrid
```

### ImageDetail Page
```
Route to /image/:id
    ↓
ImageDetail mounts
    ↓
useEffect: Fetch with id param
    ↓
Set: image, user, comments, loading=false
    ↓
Render details
    ↓
User adds comment
    ↓
handleAddComment
    ↓
Update comments state
    ↓
Re-render comments section
```

---

## API Integration

### Fetch Patterns Used

**Single Endpoint**:
```jsx
const imageRes = await fetch(`http://localhost:5000/pictures/${id}`);
const imageData = await imageRes.json();
```

**Multiple Endpoints (Parallel)**:
```jsx
const [imagesRes, usersRes, categoriesRes] = await Promise.all([
  fetch('http://localhost:5000/pictures'),
  fetch('http://localhost:5000/users'),
  fetch('http://localhost:5000/categories')
]);
```

**Query Parameters**:
```jsx
const commentsRes = await fetch(`http://localhost:5000/comments?picture_id=${id}`);
```

---

## Error Handling

**Current Implementation**:
```jsx
try {
  // fetch operations
} catch (error) {
  console.error('Error fetching data:', error);
} finally {
  setLoading(false);
}
```

**Error Display**:
- Console logging only
- No error UI currently
- Graceful fallback (empty state)

---

## Performance Considerations

1. **Component Re-renders**
   - useCallback not used (simple app)
   - useMemo not needed (small datasets)
   - Optimization for future scaling

2. **Data Fetching**
   - useEffect prevents duplicate fetches
   - Promise.all for parallel requests
   - No infinite scroll (all data loaded)

3. **Styling**
   - CSS Grid (hardware accelerated)
   - Transitions/animations smooth
   - Mobile-first breakpoints

---

## Testing Recommendations

### Unit Tests
- ImageCard: Test props rendering
- CategoryFilter: Test active state
- ImageGrid: Test no results message

### Integration Tests
- Home: Search functionality
- Home: Filter functionality
- ImageDetail: Data loading
- Navigation: Route changes

### E2E Tests
- Search and filter combined
- Image detail flow
- Back navigation
- Comment addition

---

## Future Component Ideas

1. **UserProfile Component** - Display user info and their images
2. **CommentItem Component** - Individual comment with user info
3. **StatBar Component** - Reusable stats display
4. **ActionButtons Component** - Reusable button group
5. **SearchBar Component** - Extracted search logic
6. **Modal Component** - For lightbox view
7. **Pagination Component** - For pagination
8. **InfiniteScroll Component** - For infinite scroll

---

## Styling Best Practices Used

1. **Separation of Concerns**
   - One CSS file per component
   - Modular, scoped styles
   - Easy to maintain

2. **Responsive Design**
   - Mobile-first approach
   - Media query breakpoints
   - Flexible layout

3. **Accessibility**
   - Semantic HTML buttons
   - Good color contrast
   - Focus states on inputs

4. **Performance**
   - CSS Grid (GPU accelerated)
   - Smooth transitions
   - Optimized selectors

---

## Dependencies

- **react** (v19.2.0) - UI library
- **react-dom** (v19.2.0) - React DOM binding
- **react-router-dom** (v6.20.0) - Routing

No external CSS frameworks - pure CSS used!

---

## Code Organization

### Component File Structure
```jsx
import React, { useState, useEffect } from 'react';
import '../styles/Component.css';

function ComponentName(props) {
  // State declarations
  // Effects declarations
  // Event handlers
  // JSX return
}

export default ComponentName;
```

### Naming Conventions
- Components: PascalCase (Home, ImageCard)
- Files: PascalCase (Home.js, ImageCard.js)
- CSS Files: PascalCase (Home.css, ImageCard.css)
- Props: camelCase (searchQuery, onSearchChange)
- State: camelCase (selectedCategory)

---

## Next Steps for Enhancement

1. Extract search logic into custom hook
2. Create custom fetch hook for API calls
3. Add error boundaries
4. Implement context API for state
5. Add prop validation with PropTypes
6. Extract magic strings to constants
7. Add accessibility attributes
8. Implement lazy loading for images

---

*Last Updated: November 4, 2025*
*PinPhoto v1.0 Documentation*
