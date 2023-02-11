# Volleyball Management System
VMS is an application to visualize rotations and gameplay data.

## Position management
* Create rotations
* Create actors with different roles (Setter, Middle Blocker, Libero, Outside Hitter, Opposite Hitter and Defensive Specialist)
* Manage position of actors
* Free draw
* Export/Import

## Statistics
* Collect gameplay data in parallel
* View graphs and data summaries for your collected data
* Dynamically filter data by source player, target player and labels
* Share the data

## Hosting it yourself
### Using GitHub
This won't make the application a lot more private, but at least it wont be publicly advertised

* Create a GitHub account (if you dont already have one) and log in
* Fork this repository
* Clone this repository
* Create a Firebase firestore and copy credentials into `frontend/src/environments`.
  * Follow steps 9 and 10 from [here](https://developers.google.com/codelabs/building-a-web-app-with-angular-and-firebase#8) for this.
* Checkout the branch `ghpage`
* Go into the `frontend` directory
* Run the command `npm run build:ghpage`
* Push everything to `ghpage`
* Enable GitHub pages in the settings
* Use as source `Deploy from a branch`
* Choose `ghpage` and `/docs`
* After a while the page will be available under `https://<YOUR USERNAME>.github.io/vb_positions/`

### Using a private server
Potentially have a private application, because you can keep domain, firestore credentials and team name a secret.
You are on your own!

* Build and configure the application, described as above
* Deploy `docs` onto a webserver and configure it to be accessible via the internet.