require("dotenv").config();

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

var spotify = require("node-spotify-api");
var Spotify = new spotify(keys.spotify);


var command = process.argv[2];
var search = process.argv[3];


function logData(log) {
    fs.appendFile("log.txt", log, (error) => {
        if (error) {
            throw error;
        } else {
            console.log("log ok");
        }
    });
}

function getMeSpotify(search) {
    var songname = search;
    var log = ""
    if (!search) {
        var songname = "The Sign";
    }

    Spotify.search({ type: "track", query: songname }, function (error, data) {

        if (!error) {
            var song = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (song[i]) {
                    var artists = "unavailable";
                    if (song[i].artists[0]) {
                        artists = "";
                        for (x = 0; x < song[i].artists.length; x++) {
                            artists += song[i].artists[x].name
                            if (x + 1 < song[i].artists.length) {
                                artists += ", "; 
                            }
                        }
                    }
                    var preview = "unavailable";
                    if (song[i].preview_url) { 
                        preview = song[i].preview_url;
                    }
                    var music =
                        "==========================" + "\r\n" +
                        "- Artist(s): " + artists + "\r\n" +
                        "- Song's Name: " + song[i].name + "\r\n" +
                        "- Preview link: " + preview + "\r\n" +
                        "- Album: " + song[i].album.name + "\r\n";
                    log += music;
                }
            }
        } else {
            console.log("Error :" + error);
        }
        console.log(log);
        logData(log); 
    });

}

function getMeMovies(search) {
    var movie = search;
    var log = "";
    if (!search) {
        var movie = "Mr. Nobody";
        log += "If you haven't watched 'Mr. Nobody', then you should: <http://www.imdb.com/title/tt0485947/> - It's on Netflix!";
    }
    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(url,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var movieData =
                    "========================" + "\r\n" +
                    "title: " + JSON.parse(body).Title + "\r\n" +
                    "Year: " + JSON.parse(body).Year + "\r\n" +
                    "IMDB rating: " + JSON.parse(body).imdbRating + "\r\n";
                if (JSON.parse(body).Ratings[1]) {
                    movieData += 
                    "Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value + "\r\n";
                }
                else {
                    movieData += 
                    "Rotten Tomatoes rating: not rated.\r\n";
                }
                movieData += 
                    "Country: " + JSON.parse(body).Country + "\r\n" +
                    "Language : " + JSON.parse(body).Language + "\r\n" +
                    "Plot: " + JSON.parse(body).Plot + "\r\n" +
                    "Actors: " + JSON.parse(body).Actors + "\r\n" +
                    "========================" + "\r\n";
                log += movieData;
                console.log(log);
                logData(log);
            } else {
                console.log("OMDB error: " + error);
                return;
            };

        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            var resultsarray = data.split("\r\n");
        
            for (var j = 0; j < resultsarray.length; j++) {    
                console.log(JSON.stringify(resultsarray[j]));
                var res = resultsarray[j].split(","); 
                console.log("res2:" + res[1]);
                commandLiri(res[0], res[1]); 
            }
        } else {
            console.log("random.txt file error : " + error);
        }
    });
}

function commandLiri(command, search) {
    if (command === "spotify-this-song") {
        getMeSpotify(search);
    }
    else if (command === "movie-this") {
        getMeMovies(search);
    }
    else if (command === "do-what-it-says") {
        doWhatItSays(); 
    }


}
commandLiri(command, search); 