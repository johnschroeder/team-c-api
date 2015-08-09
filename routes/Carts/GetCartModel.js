/**
 * Created by johnschroeder on 7/29/15.
 */

var express = require("express");
var router = express.Router();

router.route("/:cartID/:productID?").get(function(req, res) {
    require('../../imp_services/cartModelBuilder.js').buildCart(
        req.params.cartID,
        req.params.productID !== undefined ? req.params.productID : null,
        function(result) {
            res.send(result);
        }
    );
});
module.exports = router;