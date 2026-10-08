Issue 1: first thought is to make a cached request to the backend to get 20ish values back, My plan is to request a page number from the frontend and the api will return the 20 values that would be on that specific page (ex: page 7, vals 120-140) Then there will be next page buttons that will fetch the values for the next page. This will be maintained with a state value for the "page" they are on that is sent in the request. The cache will be good so that if they go back to page 7 after the initial request it will be much quicker to get the data rendered. So rendering would happen on the frontend cached, and backend would provide the values when needed. DONE

Issue 2: Before looking too much in the code im thinking this value should just be passed in an endpoint, If its being calculated at all that is going to be slow and out of date. Will make updates to this once I look at the code. Okay looked at the calculateTotal and saw that it was adding the .amount instead of .total, made that update so the surcharge was included. DONE

Issue 3: first thing I noticed was blank screen when submitting, both if the data is complete or not. So fix that, prevent submission if the fields aren't filled out and also ensure the home page renders again after submission. I would also like to format the dollar amount if I have time. Will look at the api code as well.

Issue 4: Should be simple, just pass the details and make the table clickable. Should handle going back to home page and display a good breakdown of the data we have on the transaction.

Issue 5: Move calculateTotal logic to backend, adding a testing suite for creating new transactions minimum. clean up unused routes.

First commit: update to use .total instead of amount, shows that I found the second issue

second commit: update to use pagination and caching on the frontend, moved search, terms, and total to the backend and added a debounce in the search, be sure to explain the breakdown of each file that needs elaboration, explain mutate if needed.

third commit: new transactions page, vastly improving logic by adding protection to the submit on the frontend and backend, adding UI improvements to better communicate what needs to happen on the page, and better displaying the money and handling floats.

fourth commit: added surcharge to the new transactions as an optional field. surcharge rate also calculated now as surcharge/amount

fifth commit: created two new files and removed one. Created: TransactionDetailsPage and useTransaction Removed: TransactionModal, updated logic to handle the page instead of the modal and added caching for those requests of data to prevent unnecessary api calls.

Data flow: A user types into the search box, there is a debounce to prevent multiple api calls, but an api call is made after the debounce passing the search value as a param, then the endpoint finds the entries that match that search and return them to be rendered. Once the response comes back the new values are rendered. The values are also cached so that the same search will not require an api call in the future.

Task 1 split: I made it so the frontend is keeping track of the page we are on with state, and on each request we are passing that value, which defaults to 1 on both FE and BE. It then gets the 50 responses that coordinate to that page and returns them. the frontend then renders all of the transactions it got in the response. Caching the responses to prevent tons of repeat fetches unless something changed (adding a new transaction) I did this because it allows for most of the decision making to happen on the server which will be much quicker and keep the frontend simple in its rendering. I think my biggest concern with the page method as scaling happened is that it would slow down significantly. The backend is still getting all the values and then finding the ones I want, so it would be better to just grab the ones I want using SQL to speed up the process.

Probably the weakest part is the way the data is being handled in the get transactions. If it was going to prod it would be much better optimized. I would make a change in the code to fetch only the 50 I want instead. so calculating the start, limiting to 50 results, and adding where clauses for the search val.
