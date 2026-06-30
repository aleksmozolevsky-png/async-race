# Async Race SPA

### 📊 Evaluation Metrics

- **Calculated Score:** 400 / 400 pts (Self-check)
- **Deployment Link:** https://aleksmozolevsky-png.github.io/async-race/

---

## 🚀 Checklist

### UI Deployment

- [x] **Deployment Platform:** Successfully deploy the UI on one of the following platforms: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a similar service.

### ✅ Requirements to Commits and Repository

- [x] **Commit guidelines compliance:** Ensure that all commits follow the specified commit guidelines, thereby promoting a clear and consistent commit history.
- [x] **Checklist included in README.md:** Include the project's checklist in the README.md file.
- [x] **Score calculation:** Use this checklist to calculate your score and put it at the top.
- [x] **UI Deployment link in README.md:** Place the link to the deployed UI at the top of the README.md file.

### 🧱 Basic Structure (80 points)

- [x] **Two Views (10 points):** Implement two primary views: "Garage" and "Winners".
- [x] **Garage View Content (30 points):** The "Garage" view displays the view name, car creation/editing panel, race control panel, and the garage section.
- [x] **Winners View Content (10 points):** The "Winners" view displays the view name, winners table, and pagination.
- [x] **Persistent State (30 points):** Ensure the view state remains consistent when navigating between views (preserving page numbers and input states).

### 🚗 Garage View (90 points)

- [x] **Car Creation And Editing Panel. CRUD Operations (20 points):** Enable users to create, update, and delete cars. Empty and too long names are handled properly. Deleting a car removes it from both garage and winners.
- [x] **Color Selection (10 points):** Allow color selection from an RGB palette, displaying the selected color on the car's image.
- [x] **Random Car Creation (20 points):** Button to generate 100 random cars per click (assembled from 10+ random names/brands and random colors).
- [x] **Car Management Buttons (10 points):** Provide buttons near each car's image for updating its attributes or deleting it.
- [x] **Pagination (10 points):** Implement pagination for the "Garage" view, displaying 7 cars per page.
- [x] **EXTRA POINTS (20 points):**
  - [x] _Empty Garage:_ Handle empty garage with a user-friendly message.
  - [x] _Empty Garage Page:_ Removing the last car on a page automatically moves the user to the previous page.

### 🏆 Winners View (50 points)

- [x] **Display Winners (15 points):** After a car wins, it is displayed or updated in the "Winners view" table.
- [x] **Pagination for Winners (10 points):** Implement pagination for the "Winners" view, with 10 winners per page.
- [x] **Winners Table (15 points):** Table includes columns for №, image, name, number of wins, and best time. Wins increment, and time updates only if it's better.
- [x] **Sorting Functionality (10 points):** Allow users to sort the table by the number of wins and best time, in ascending or descending order.

### ⚡ Race (170 points)

- [x] **Start Engine Animation (20 points):** Click start -> wait for velocity -> animate car. Handles 500 error (engine breakdown) by stopping animation.
- [x] **Stop Engine Animation (20 points):** Click stop -> wait for answer -> car returns to its initial place.
- [x] **Responsive Animation (30 points):** Ensure car animations are fluid and responsive on screens as small as 500px.
- [x] **Start Race Button (10 points):** Start button starts the race for all cars on the current page.
- [x] **Reset Race Button (15 points):** Reset button returns all cars to their starting positions.
- [x] **Winner Announcement (5 points):** Display a message with the winning car's name upon finishing first.
- [x] **Button States (20 points):** Correctly disable/enable start/stop buttons depending on the car's engine/driving state.
- [x] **Actions during the race (50 points):** Ensure predictable application behavior during a running race (handling page changes, view switches, or blocking actions).

### 🎨 Prettier and ESLint Configuration (10 points)

- [x] **Prettier Setup (5 points):** Prettier is correctly set up with `format` and `ci:format` scripts in `package.json`.
- [x] **ESLint Configuration (5 points):** ESLint is configured with strict TypeScript settings and style rules, with a working `lint` script.

### 🌟 Overall Code Quality. (100 points) Skip during self-check

- [ ] (Up to 100 points) Discretionary points awarded by the reviewer based on overall code quality, readability
- [ ] Modular Design The application should be clearly divided into logical modules or layers, such as API interaction, UI rendering, and state management.
- [ ] Function Modularization Code should be organized into small, clearly named functions with specific purposes. Common functions moved to helper. Each function should not exceed 40 lines.
- [ ] Code Duplication and Magic Numbers Minimize code duplication and maintain readability by avoiding the use of magic numbers or strings throughout the codebase.
- [ ] Readability Clear, readable code. Understandable names of variables, functions, modules
- [ ] Extra features Example for React: Custom hooks, Portals, React Router

### 🔄 Evaluation Rules

- [@Candidate] The UI should be deployed to gh-pages, Netlify, or a similar service, and the link should be included in the README.md.
- [@Reviewer] You should clone the server repository and keep the server running during the functionality review.
- [@Reviewer] Test task should be evaluated based on both functional and non-functional requirements.
- [@Candidate] Pay close attention to details in the implementation, as bugs and deviations from the requirements can impact your score.
- [@Reviewer] If bugs are found, the following deductions can be applied:
  - (-30) Major bug (implemented functionality works but breaks down after certain manipulations, with unexpected errors in the browser's console).
  - (-10) Minor bug (implemented functionality works but behaves inconsistently after certain manipulations, such as a button not becoming enabled after changing some state, with no errors in the browser's console).
  - Note: If you repeatedly press the "start engine button" then the "stop engine button" or the "start race button" then the "reset race button" and see a "404" or "429" error, this is not considered a bug.
