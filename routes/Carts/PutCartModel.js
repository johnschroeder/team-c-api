/**
 * Created by johnschroeder on 7/29/15.
 */

/*TODO:
    id the dirty item
    delete cartItem

    amountToReserve = dirty model's requested amount
    location = dirty model's location
    size = dirty model's size
    productID = dirty model's productID

    if(amountToReserve === 0)
        res.send("it worked");

    reserveWrapper(cartID, productID, location, packageCount, packageSize, sizeMapID, toReserve, function() {
        res.send("it worked");
    }

    sp1(cartID, productID, location, packageCount, packageSize, sizeMapID, toReserve):
        iterate through all runs (oldest first) at location for the product
        when it encounters a run with available quantity reserve up to _toReserve using the size,
            and count the number of packages of that size were deducted
        create cartItem
        return _toReserve


    sp2(cartID, productID, location, toReserve):
        get size of singles from productID
        iterate through all runs (oldest first) at location for the product
        when it encounters a run with available quantity reserve up to _toReserve of singles
        create cartItem
        returns _toReserve


    function reserveWrapper(cartID, productID, location, sizeMapID, toReserve, callback)
    {
        calls sp1
        if(toReserve > 0)
            call reserve(cartID, productID, location, toReserve, callback)
        else
            callback()
    }

    function reserve(cartID, productID, location, toReserve, callback)
    {
        hit the sp.
        if(toReserve > 0)
            reserve(cartID, productID, location, toReserve, callback)
        else
            callback()
    }



    delete the cart item

    if(amountToReserve == 0)
    {
        return;
    }


    reserveFromOldest(amountToReserve, callback)
    {
        if(amountToReserve > 0)
        {
            sp(amountToReserve, callback)
            reserveFromOldest(amountToReserve, callback)
        }
    }

    if so:
        delete the cart item
        carry stillToReserve int
        call a recursive function that reserves a quantity from oldest run and returns
    otherwise:
        delete the cart item and replace it with the changed version
        reserve from oldest
 */
