# Trading Front End 

## About This Project 

This is the front end code-base for my full stack trading web site, the backend API of which can be found <a href="https://github.com/mulcharv/tradingapi/tree/main" target="blank">here</a>. Features of this project include: 

* Pages for visitors to sign up and login
* A responsive navigation bar that provides links for the user to signup and/or login if no JWT present. If a JWT is present, it provides links to logout, the user's account, portfolio, and activity. 
* In addition to the above, when logged in the navigation bar has a search bar in which stock symbols can be input for links to their respective pages to populate below it
* A home page that prompts user to login/signup if no JWT present, and shows summaries of the user's account, portfolio, and watchlist if logged in.
* An account page that lists the current balance, account creation date, last activity date, and inputs to add/withdraw amounts from the account.
* A portfolio page that lists the total value (at the current moment) of it, realized gain/loss, unrealized gain/loss, portfolio creation date, last activity date, and a list of current positions held in it.
* Stock page with an add/remove to watchlist toggle, update price (to the current moment) button, a graph showing the performance of the stock over a set interval (defaulted to 1 day, with options for 1 week, 1 month, 3 months, 6 months, and 1 year). Also includes information on the user's holdings of the stock  (quantity, total value, and all time performance).
* An order portal on the above stock page that allows one to buy/sell a chosen amount of shares. Once a secondary buy/sell button is pressed, the latest price is retrieved and displayed with the order information above confirm/cancel buttons. This allows a more accurate/up to date transaction for the user.

This application uses the build tool Vite and the the Javascript library React due to their ease of use, speed, and wide applicability. 
It sends fetch requests to a backend API I built that can be found <a href="https://github.com/mulcharv/tradingapi/tree/main" target="blank">here</a>.
For a live demonstration of the above features, please click the link in the reponsitory's about section. 

## Key Learnings 

This project required the display of various types of information, all of which had complex relationships with eachother. This provided the opportunity to learn the following:

* How to structure multiple fetch requests, with necessary query/body information into one function that can be called on the useEffect hook to load a page with all information.
* How to handle POST fetch requests with multiple configurations based on the body information (whether an account is having an amount added or withdrawn).
* Correctly resetting state after a successful request has been made to clear it of fetch request information in lieu of the next possible one.
* Loop through data received from a GET fetch request, and create new variables before setting them into state and using them in the return statement.
* Integrate fetch request data into properly formatted datasets so that they can be displayed through graph components (ChartJs used in this case).
* Splitting up functions within a component in a logical way such that there is seperation of concerns when they are called upon to load respective fetch data.
* Setting up the use effect dependancy array with certain variables so that the page reloads itself and the specific functions included.

## Future Opportunities 

There exist a couple of possibilities to add features in the future that will enhance the application, which include:

* Finding more efficient logic to calculate the total current values of the user portfolio and each stock holding on the portfolio page. Currently there is a significant loading delay.
* A more logical and streamlined way to lock in the latest price for buy/sell orders on the stock page. Currently, even with the price updating between the initial and confirmation orders, it can remain outdated/inaccurate if the user does not immediatly lock in their order confirmation.
* CSS styling for mobile viewing. Given the round the clock nature of trading, it makes sense for users to be able to view their information just as easily on mobile as desktop.

## Acknowledgements 

Resources that were helpful in creating this application.

* <a href="https://www.npmjs.com/package/multer" target="blank">Multer</a>
* <a href="https://www.npmjs.com/package/react-icons" target="blank">React Icons</a>
* <a href="https://www.npmjs.com/package/uniqid" target="blank">Uniqid</a>
* <a href="https://www.npmjs.com/package/jwt-decode" target="blank">JWT Decode</a>
* <a href="https://www.chartjs.org/" target="blank">Chart JS</a>

## About Me 

Visit my <a href="https://github.com/mulcharv" target="blank">about me</a> page to learn what I'm up to and contact me. 
  




