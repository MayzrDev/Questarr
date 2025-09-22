# Video Game Management Application Design Guidelines

## Design Approach
**Reference-Based Approach**: Inspired by Radarr's clean dashboard interface and Steam's library view, focusing on organized media management with grid-based layouts for efficient game discovery and collection management.

## Core Design Elements

### A. Color Palette
**Dark Theme Foundation**:
- Primary: #3B82F6 (blue) - 217 91% 60%
- Secondary: #10B981 (emerald) - 160 84% 39% 
- Background: #1F2937 (dark slate) - 210 24% 16%
- Cards: #374151 (grey) - 210 20% 25%
- Text: #F9FAFB (light) - 210 20% 98%
- Accent: #F59E0B (amber) - 45 93% 47%

### B. Typography
- **Primary**: Inter font family for clean, modern readability
- **Secondary**: Roboto for data-heavy sections and metadata
- **Hierarchy**: Large headings for dashboard sections, medium for game titles, small for metadata

### C. Layout System
**Tailwind Spacing Primitives**: Focus on units of 2, 4, and 8
- Grid gaps: `gap-4` for game cards, `gap-2` for metadata
- Padding: `p-4` for cards, `p-8` for main sections
- Margins: `m-2` for small elements, `m-4` for separation

### D. Component Library

**Navigation**:
- Dark sidebar with icon-based navigation
- Active states using primary blue with subtle background highlight
- Collapsible for mobile responsiveness

**Game Cards**:
- Cover art thumbnails as primary visual element
- Status indicators (wanted/owned/completed) with color-coded badges
- Hover states revealing quick action buttons
- Grid layout with consistent aspect ratios

**Dashboard Layout**:
- Main content area with grid-based game library
- Filtering sidebar with search, genre, platform, and status filters
- Header with statistics overview and quick actions

**Game Details**:
- Full-width cover art with metadata overlay
- Tabbed content for screenshots, description, and technical details
- Action buttons for status changes and download management

**Data Displays**:
- Clean tables for release monitoring
- Progress indicators for download status
- Statistical cards for collection overview

### E. Interaction Patterns
- Minimal animations: Subtle fade-ins for loading states only
- Focus on immediate visual feedback for status changes
- Smooth transitions between grid and list view layouts

## Key Design Principles
1. **Content-First**: Game cover art drives the visual hierarchy
2. **Efficient Scanning**: Grid layouts enable quick library browsing
3. **Status Clarity**: Clear visual indicators for game collection states
4. **Dark Theme Optimization**: Designed for extended viewing sessions
5. **Responsive Adaptation**: Maintains usability across all screen sizes

This design creates a professional game management interface that balances the organizational efficiency of Radarr with the visual appeal of modern gaming platforms.