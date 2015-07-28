var express = require("express");
var router = express.Router();
var Q = require('q');
var busboy = require('connect-busboy');
router.use( busboy() );
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var IMAGE_BUCKET = 'images.thisisimp.com';
var s3 = new AWS.S3();

router.route("/").post(function(req,res){
    var size = 0;
    var prodID = 0;

    req.pipe(req.busboy);

    req.busboy.on('field', function(key,value){
        if( key == 'size' )
            size = value;

        if( key == 'prodID')
            prodID = value;
    });

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        s3.createBucket({Bucket: IMAGE_BUCKET}, function () {

            var imageFile = prodID + ".jpeg";

            var params = {Bucket: IMAGE_BUCKET, Key: imageFile, Body: file, ContentLength: size, ACL: 'public-read'};

            s3.putObject(params, function (err, data) {

                if (err)
                    console.log(err);
                else{
                    console.log("Successfully uploaded " + imageFile );
                    res.send( IMAGE_BUCKET + ".s3.amazonaws.com/" + imageFile );
                }

            });

        });
    });
});

module.exports = router;
