var express = require('express');
var router = express.Router();
var stocksController = require('../db/dbcontrollers/stocksController');
var rp = require('request-promise');
var utils = require('./utils');

module.exports = function (knex) {
  stocksController = stocksController(knex);

  router
    .param('symbol', function (req, res, next, symbol) {
      req.symbol = symbol;
      next();
    })
    .param('date', function (req, res, next, date) {
      req.date = date;
      next();
    });

//Stock Search Route
//-----------------------------------
  router.route('/')
    .get(function (req, res) {
      var search = req.query.search;
      stocksController.searchStock(search)
        .then(function (response) {
          res.json({
            data: response
          });
        });
    });

//Update Prices Route
//-----------------------------------
  router.route('/update')
    .post(function (req, res) {
      var list = req.body;
      stocksController.updatePrices(list)
        .then(function (stockArray) {
          res.status(200).json({
            data: stockArray
          });
        })
        .catch(function (err) {
          res.status(400).json({
            message: err
          });
        });
    });

//Get Stock Route
//-----------------------------------
  router.route('/:symbol')
    .get(function (req, res) {
      var symbol = req.symbol;
      stocksController.getStock(symbol).then(function (response) {
        if (response === null) {
          res.sendStatus(404);
        } else {
          res.json({
            data: response
          });
        }
      });
    });

//Get Specific Stock Data from Yahoo API route
//--------------------------------------------
//route returns a csv which includes dates and close prices for a specific stock
//the last letter on the url denotes that we ask for the weekly close prices(not day or year)

  router.route('/history/:symbol/:date')
    .get(function (req, res) {

      var stockSymbol = req.symbol;
      var startDate = new Date(req.date);

      var dateNow;
      var dateYearBefore;
      dateNow = Date.now();

      //change dateYearBefore to look at the start date of the match and substract a year of milliseconds from it
      dateYearBefore = Date.now(startDate) - 31536000000;

      //make variables for the current date
      var yearNow = new Date(dateNow).getFullYear();
      var monthNow = new Date(dateNow).getMonth();
      var dayNow = new Date(dateNow).getDate();

      //variables for the start date
      var yearStart = new Date(dateYearBefore).getFullYear();
      var monthStart = new Date(dateYearBefore).getMonth();
      var dayStart = new Date(dateYearBefore).getDate();

      var url = 'http://ichart.yahoo.com/table.csv?s='+stockSymbol+'&a='+monthStart+'&b='+dayStart+'&c='+yearStart+'&d='+monthNow+'&e='+dayNow+'&f='+yearNow+'&g=w';
      
      //send request out to the yahoo api with correct variables
      rp(url)
      .then(function (body) {

        var data = {};
        var dates = [];
        var close = [];

        var returnObj = {};
        var jsonForm = utils.csvJSON(body);
        jsonForm = JSON.parse(jsonForm);

        //make array of objects of closes and dates
        jsonForm.forEach(function (row) {
          for (var key in row) {
            if (row.Date.length !== 0 && row.Close.length !== 0) {
              var date1 = row.Date;
              data[date1] = row.Close;
            }
          }
        });

        //make array of dates in order of current to olderst
        jsonForm.forEach(function (row) {
          for (var key in row) {
            if (dates.indexOf(row.Date) === -1 && row.Date.length !== 0) {
              dates.push(row.Date);
            }
          }
        });

        //make an array of close prices in date order (current to oldest)
        for (var i = 0; i < dates.length; i++) {
          close.push(data[dates[i]]);
        }

        //reverse date arrays so earliest data is at the start
        returnObj.dates = dates.reverse();
        returnObj.close = close.reverse();

        res.status(200)
        .send(returnObj);

      })
      .catch(function (err) {

        res.status(400).json({
          message: err
        });

      });

    });

  return router;
};
