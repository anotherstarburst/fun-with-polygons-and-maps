# Fun with Polygons and Maps

This repository contains a web application for performing operations on polygons plotted on a map.

## Features

- Select two polygons and perform operations:
  - Union: Combine the selected polygons into a single shape
  - Intersect: Create a new polygon from the overlapping areas of the selected polygons
- The resulting polygon from an operation replaces the selected polygons
- Current state of polygons persists until page reload (no disk persistence required)
- Switch between different proposed solutions while maintaining polygon states
- Display the total area of selected polygons in the right panel

## Technology Stack

- Frontend Framework: React
- Build Tool: Vite
- Deployment: GitHub Pages
- Language: TypeScript

## Tests

The only tests present are for the usePolygonOperations hook, to ensure that the polygons are added / and edited as expected. Those live in the [__tests__](/__tests__/) folder.

Any geospatial calculations, or the operations on the geospatial polygons is handled by the [@turf/turf](https://www.npmjs.com/package/@turf/turf) or [@vis.gl/react-google-maps](https://www.npmjs.com/package/@vis.gl/react-google-maps) packages. We could test those libraries but it's outside of the remit of this exercise so we can hand off the work to the package maintainers. It might be sensible for a production grade application.

## Documentation

The code is designed to be as self-explanatory as possible, so you can easily understand each component or functionality without needing extensive comments. When something isn't immediately clear—like a complex operation or less intuitive variable names — I've added a comment above the relevant bit to clarify it. This keeps the code clean and minimizes documentation rot.

## Getting Started

To run this project locally, you'll need Node.js (version 20) installed on your machine.

1. Clone the repository:
   ```bash
   git clone https://github.com/anotherstarburst/fun-with-polygons-and-maps.git
   ```
2. Navigate to the project directory:
   ```bash
   cd fun-with-polygons-and-maps/
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

This will launch the application at http://localhost:5173/fun-with-polygons-and-maps/

## Usage

1. Select two polygons on the map
2. Choose an operation (union or intersect) from the control panel
3. View the result of the operation, which replaces the selected polygons
4. Switch between different proposed solutions using the provided controls
5. Check the right panel to see the total area of selected polygons

## Development

This project uses React for the frontend, with TypeScript for type safety. Vite is used as the build tool for fast development and optimized production builds.

## Deployment

The application is set up for deployment to GitHub Pages using a CI/CD pipeline. Refer to the repository's GitHub Actions configuration for details on the deployment process.

## Contributing

If you have suggestions or improvements, please open an issue or submit a pull request.

