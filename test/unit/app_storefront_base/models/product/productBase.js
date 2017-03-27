'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var toProductMock = require('../../../../util');

describe('productBase', function () {
    var ProductBase = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productBase', {
        './productImages': function () {},
        './productAttributes': function () { return []; },
        '../../scripts/dwHelpers': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/dwHelpers', {
            'dw/util/ArrayList': ArrayList
        }),
        '../../scripts/factories/price': { getPrice: function () {} }
    });

    var promotions = new ArrayList([{
        calloutMsg: { markup: 'Super duper promotion discount' },
        details: { markup: 'Some Details' },
        enabled: true,
        ID: 'SuperDuperPromo',
        name: 'Super Duper Promo',
        promotionClass: 'Some Class',
        rank: null
    }]);

    var productVariantMock = {
        ID: '1234567',
        name: 'test product',
        variant: false,
        variationGroup: false,
        productSet: false,
        bundle: false
    };

    var productMock = {
        variationModel: {
            productVariationAttributes: new ArrayList([{
                attributeID: '',
                value: ''
            }]),
            setSelectedAttributeValue: {
                return: null,
                type: 'function'
            },
            selectedVariant: productVariantMock,
            getAllValues: {
                return: new ArrayList([]),
                type: 'function'
            }
        }
    };

    it('should create a simple product with no query string params', function () {
        var mock = toProductMock(productMock);
        var product = new ProductBase(mock);

        assert.equal(product.productName, 'test product');
        assert.equal(product.id, 1234567);
        assert.equal(product.rating, 4);
    });

    it('should create a product with query string params', function () {
        var tempMock = Object.assign({}, productMock);
        var tempVariationAttributes = new ArrayList([{
            attributeID: 'color'
        }]);
        var tempGetAllValues = {
            return: new ArrayList([{
                value: 123
            }]),
            type: 'function'
        };
        tempMock.variationModel.selectedVariant.variant = true;
        tempMock.variationModel.productVariationAttributes = tempVariationAttributes;
        tempMock.variationModel.getAllValues = tempGetAllValues;
        var mock = toProductMock(tempMock);
        var product = new ProductBase(mock, { color: { value: 123 } });

        assert.equal(product.productName, 'test product');
        assert.equal(product.id, 1234567);
        assert.equal(product.rating, 4);
    });

    it('should create a product with default variant', function () {
        var tempMock = Object.assign({}, productMock);
        tempMock.variationModel.selectedVariant = null;
        tempMock = Object.assign({}, productVariantMock, tempMock);
        tempMock.variant = false;
        tempMock.variationGroup = true;
        var product = new ProductBase(toProductMock(tempMock), { color: { value: 123 } }, null);

        assert.equal(product.productName, 'test product');
        assert.equal(product.id, 1234567);
        assert.equal(product.rating, 4);
    });

    it('should contain an array of promotions', function () {
        var expectedPromotions = [{
            calloutMsg: 'Super duper promotion discount',
            details: 'Some Details',
            enabled: true,
            id: 'SuperDuperPromo',
            name: 'Super Duper Promo',
            promotionClass: 'Some Class',
            rank: null
        }];

        var tempMock = Object.assign({}, productMock);
        tempMock.variationModel.selectedVariant = null;
        tempMock = Object.assign({}, productVariantMock, tempMock);
        tempMock.variant = false;
        tempMock.variationGroup = true;
        var product = new ProductBase(toProductMock(tempMock), null, promotions);

        assert.deepEqual(product.promotions, expectedPromotions);
    });

    it('should handle no promotions provided', function () {
        var tempMock = Object.assign({}, productMock);
        tempMock = Object.assign({}, productVariantMock, tempMock);
        var product = new ProductBase(toProductMock(tempMock), null);

        assert.equal(product.promotions, null);
    });
    it('should create a product which is not a master and not a variant ', function () {
        var tempMock = Object.assign({}, productMock);
        tempMock.variationModel.selectedVariant = null;
        tempMock.variant = false;
        tempMock.variationModel.master = false;
        tempMock = Object.assign({}, productVariantMock, tempMock);
        var product = new ProductBase(toProductMock(tempMock));

        assert.equal(product.productName, 'test product');
        assert.equal(product.id, 1234567);
        assert.equal(product.rating, 4);
    });

    it('should create a master product', function () {
        var tempMock = Object.assign({}, productMock);
        tempMock.variationModel.selectedVariant = null;
        tempMock = Object.assign({}, productVariantMock, tempMock);
        tempMock.variant = false;
        tempMock.variationModel.master = true;
        var product = new ProductBase(toProductMock(tempMock));

        assert.equal(product.productName, 'test product');
        assert.equal(product.id, 1234567);
        assert.equal(product.rating, 4);
    });
});
