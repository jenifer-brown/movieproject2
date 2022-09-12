# movieproject2
A movie lookup site with more features

Introduction:
In Project 2, you’ll update Project 1 to make it even more useful! You’ll create a reusable movie component and display all search results instead of just the first one, and use a state manager to coordinate showing the components. You’ll also add the ability to add a movie to favorites, which will be loaded and displayed when the site loads. Finally, you’ll add the ability to let users leave a note attached to a movie which will be displayed whenever the movie is viewed.

Tasks:
Create a branch off of your Project 1 codebase for this work
Replace your existing movie lookup flow to include a state manager:
The search form should change the “search” state
A change in the “search” state should cause a movie lookup, with the results put into the “movies” state
A change in the “movies” state should change what movies are displayed. All movies in the “movies” state should be displayed
The API Key input should be saved into IndexedDB and and change the “key” state. On site load, the key from IndexedDB should be loaded into the “key” state.
A change in the “key” state (whether it’s available or not) should change whether the API Key input should be displayed
Add a “reset” button to the search form that resets all form fields, clears the “search” state, but keeps the “key” state.
Replace your existing movie display with a reusable movie web component that includes:
Title
Year
Rating
Release Date
Poster (if it has it)
Favorite toggle (see below)
Note (see below)
Create the ability to favorite a movie:
Clicking the favorite toggle in the movie web component should change the “favorites” state
When the “favorites” state changes, the list of favorite movies should be saved to IndexedDB, along with the data for the favorite movie. Only movies that are currently part of “favorites” should be stored in IndexedDB
If there is no “search” state, set the “movies” state to the data for favorite movies
Let users leave a note for a movie:
Add a button “view notes” for each movie that, when clicked, displays notes (next) and changes to “hide notes”. When clicked again, it should hide the notes and change back to “view notes”.
Notes should be a long form text area loaded with whatever notes exist for the given movie
Whenever input happens in the text area, the value should be saved to IndexedDB for that movie
If a movie has notes associated with it, when “view notes” is clicked, the existing notes should be displayed, even across page loads
Submit your code by pushing it to GitHub, optionally ensuring that there are no Prettier errors
