// Variables

var firstArrival;
var frequency;
var database;
var name;
var destination;
var trainFirebaseData;
var newFirebaseData;
var time;
var clock;
$(document).ready(function () {


    function runningClock() {
        time = moment().format("hh:mm:ss A");
        $("#time").text(time);
    }
    //  setInterval function
    clock = setInterval(runningClock , 1000);

  
      // Initialize Firebase
      var config = {
          apiKey: "AIzaSyBfSNkffTACKCdvxulZ8ZqgdQZ7Rq_HenE",
          authDomain: "train-scaduler.firebaseapp.com",
          databaseURL: "https://train-scaduler.firebaseio.com",
          projectId: "train-scaduler",
          storageBucket: "train-scaduler.appspot.com",
          messagingSenderId: "1018608400193"
      };
    firebase.initializeApp(config);

    database = firebase.database();

    $("#submitButton").on("click", function (event) {

        event.preventDefault();

        //  Grab Input values IF the conditon above is true
        name = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstArrival = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();



        console.log(firstArrival);



        //  write and link variable into firebase
        trainFirebaseData = {
            DatatrainName: name,
            Datadest: destination,
            DatafirstArrival: firstArrival,
            Datafrequency: frequency,
            TimeStamp: firebase.database.ServerValue.TIMESTAMP
        };

        
        database.ref().push(trainFirebaseData);

    //  clear the fields 
        clear();

    });

    database.ref().on("child_added", function (childSnapshot) {
        //  referencing the variables
        var snapName = childSnapshot.val().DatatrainName;
        var snapDest = childSnapshot.val().Datadest;
        var snapFreq = childSnapshot.val().Datafrequency;
        var snapArrival = childSnapshot.val().DatafirstArrival;

        //  Current Time
        var timeIs = moment();
        //  Convert Time and configure for Future use by pushing firstArrival back 1 year
        var firstArrivalConverted = moment(snapArrival , "HH:mm A").subtract(1, "years");
        //  compare now and First Arrival
        var diff = moment().diff(moment(firstArrivalConverted) , "minutes");
        var left = diff % snapFreq;
        //  How long till train
        var timeLeft = snapFreq - left;
        var newArrival = moment().add(timeLeft , "m").format("HH:mm: A");

        $("#table-info").append("<tr><td>" + snapName +"</td><td>" + snapDest + "</td><td>" + snapFreq + "</td><td>" +
                                    newArrival + "</td><td>" + timeLeft + "</td></tr>");


    });
    // clear of the fields
    function clear() {
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrainTimeInput").val("");
        $("#frequencyInput").val("");
    }



});
