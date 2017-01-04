'use strict';

var assert = require('chai').assert;
var Order = require('../../../../cartridges/app_storefront_base/cartridge/models/order');

var createApiBasket = function () {
    return {
        billingAddress: true,
        defaultShipment: {
            shippingAddress: true
        },
        orderNo: 'some String',
        creationDate: 'some Date',
        customerEmail: 'some Email'
    };
};

var shippingModel = {};
var billingModel = {};
var orderTotals = {};
var lineItems = {};

describe('Order', function () {
    it('should handle null parameters', function () {
        var result = new Order(null, null, null, null, null);
        assert.equal(result.shipping, null);
        assert.equal(result.billing, null);
        assert.equal(result.totals, null);
        assert.equal(result.items, null);
        assert.equal(result.steps, null);
        assert.equal(result.orderNumber, null);
        assert.equal(result.creationDate, null);
        assert.equal(result.orderEmail, null);
    });

    it('should handle a basket object ', function () {
        var result = new Order(
            createApiBasket(),
            shippingModel,
            billingModel,
            orderTotals,
            lineItems
        );
        assert.equal(result.shipping, shippingModel);
        assert.equal(result.billing, billingModel);
        assert.equal(result.totals, orderTotals);
        assert.equal(result.items, lineItems);
        assert.deepEqual(result.steps, {
            shipping: {
                iscompleted: true
            },
            billing: {
                iscompleted: true
            }
        });
        assert.equal(result.orderNumber, 'some String');
        assert.equal(result.creationDate, 'some Date');
        assert.equal(result.orderEmail, 'some Email');
    });

    it('should handle a basket that does not have a defaultShipment', function () {
        var basket = {
            billingAddress: true
        };
        var result = new Order(basket, null, null, null, null);
        assert.deepEqual(result.steps, {
            shipping: {
                iscompleted: false
            },
            billing: {
                iscompleted: true
            }
        });
    });
});
