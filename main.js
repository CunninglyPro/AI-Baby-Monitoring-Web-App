var alarm = "";
var objects = [];
var cocossd_status = "";

function preload() {
    alarm = loadSound('alarm.mp3');
}

function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Object";
}

function draw() {
    image(video, 0, 0, 380, 380);

    if (cocossd_status != "") {
        var r = random(255);
        var g = random(255);
        var b = random(255);

        objectDetector.detect(video, gotResults);

        for (i = 0; i < objects.length; i++) {

            if (objects[i].label == "person") {
                document.getElementById("status").innerHTML = "Status: Objects Detected";
                document.getElementById("baby").innerHTML = "Baby Found";
                alarm.stop();

                percent = floor(objects[i].confidence * 100);
                fill(r, g, b);
                text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
                noFill();
                stroke(r, g, b);
                strokeWeight(1);
                rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            } else {
                alarm.play();
                document.getElementById("baby").innerHTML = "Baby not Found";
            }
        }

        if (objects.length < 0) {
            document.getElementById("baby").innerHTML = "Baby not Found";
            alarm.play();
        }
    }
}

function modelLoaded() {
    console.log("Model is loaded!");
    cocossd_status = true;

}

function gotResults(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        objects = results;
    }
}