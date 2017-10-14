#!/usr/bin/env node
const vorpalLog = require("vorpal-log");
const vorpalTour = require("vorpal-tour");
const vorpal = require("vorpal")();
const shell = require("shelljs");
const path = require("path");

// https://github.com/vorpaljs/vorpal-tour/
// https://github.com/AljoschaMeyer/vorpal-log/

// let webEnv
// try {
//   webEnv = require(path.join(process.cwd(), "environment.web"));
// } catch (e) {
//   // throw e;
// }
// try {
//   webEnv = require(path.join(process.cwd(), "src", "environment.web"));
// } catch (e) {
//   // throw e;
// }

// if (!webEnv) {
//   console.error(`Could not require transmute framework from: ./environment.web.js or ./src/environment.web.js`);
//   console.log(`Have you run 'cp ~/.transmute/environment.web.js .' or 'transmute init'  ?`);
// } else {
 
//   let T = webEnv.TransmuteFramework;
//   // console.log(T)
//   vorpal.T = T;
// }


vorpal.use(vorpalLog);

try{
  const { TransmuteFramework, transmuteConfig } = require(path.join(
    process.cwd(),
    "./functions/.transmute/environment.web"
  ));
  vorpal.T = TransmuteFramework.init(transmuteConfig); 
} catch(e) {
  vorpal.logger.warn('No ./functions/.transmute/environment.web was detected. Firebase CLI will not function.')
}

vorpal.use(vorpalTour, {
  command: "tour",
  tour: function(tour) {
    // Colors the "tour guide" text.
    tour.color("cyan");

    // Adds a step to the tour:
    // .begin spits user instructions when the step starts
    // .expect listens for an event. The function it calls
    //   expects a `true` to be called in order for the step
    //   to finish.
    // .reject spits text to the user when `false` is returned
    //   on an `.expect` callback.
    // .wait waits `x` millis before completing the step
    // .end spits text to the user when the step completes.
    tour
      .step(1)
      .begin('Welcome to the tour! Run "setup".')
      .expect("command", (data, cb) => {
        cb(data.command === "setup");
      })
      .reject('Uh.. Let\'s type "setup" instead...')
      .wait(500)
      .end("Great! You now have a ~/.transmute");

    // vorpal.logger.log(" ");

    tour
      .step(2)
      .begin(
        'Make sure ~/.transmute/environment.secret.env is correct BEFORE PROCEEDING. Run "init ."'
      )
      .expect("command", (data, cb) => {
        cb(data.command === "init .");
      })
      .reject('Uh.. Let\'s type "init ." instead..')
      .wait(500)
      .end("Great! You now have a sample dapp to play with. See the dapp README.md for the next steps!");

    // A delay in millis between steps.
    tour.wait(1000);

    // Ends the tour, spits text to the user.
    tour.end("Very well done!");

    return tour;
  }
});

require("./scripts")(vorpal);

vorpal.parse(process.argv).delimiter("🦄   $").show();
