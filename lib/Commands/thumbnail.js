"use strict";
/*
 EasyImage

 EasyImage is a promise-based image processing module
 for Node.js, it is built on top of ImageMagick, so
 make sure ImageMagick is installed on your system.

 Copyright (c) 2015 Hage Yaapa <http://www.hacksparrow.com>
 Maintained by Kevin Gravier <http://github.com/mrkmg>

 MIT License
 */
exports.__esModule = true;
var tslib_1 = require("tslib");
var Bluebird = require("bluebird");
var Utilities_1 = require("../Utilities");
var ImageMagick_1 = require("../ImageMagick");
var info_1 = require("./info");
var UnsupportedError_1 = require("../Errors/UnsupportedError");
Promise = Promise || Bluebird;
/**
 * Creates a thumbnail of an image.
 *
 * @param {IThumbnailOptions} options
 * @returns {Bluebird<IInfoResult>}
 */
function thumbnail(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var infoData, args;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Utilities_1.applyDefaultsToBaseOptions(options);
                    applyDefaultsToThumbnailOptions(options);
                    Utilities_1.checkForMissingOptions(options, ["src", "width", "height"]);
                    return [4 /*yield*/, Utilities_1.ensureDestinationDirectoryExists(options)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, info_1.info(options.src)];
                case 2:
                    infoData = _a.sent();
                    args = [options.src];
                    Utilities_1.applyBaseOptionsToArgs(options, args);
                    if (options.gravity) {
                        args.push("-gravity", options.gravity);
                    }
                    args.push("-interpolate", options.interpolate);
                    args.push("-strip");
                    if (infoData.width > infoData.height) {
                        args.push("-thumbnail", "x" + options.height);
                    }
                    else {
                        args.push("-thumbnail", options.width + "x");
                    }
                    args.push("-crop", options.width + "x" + options.height + "+" + options.x + "+" + options.y);
                    args.push(options.dst);
                    return [4 /*yield*/, ImageMagick_1.execute("convert", args)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, info_1.info(options.dst)];
            }
        });
    });
}
exports.thumbnail = thumbnail;
function applyDefaultsToThumbnailOptions(options) {
    if (!options.x) {
        options.x = 0;
    }
    if (!options.y) {
        options.y = 0;
    }
    if (!options.interpolate) {
        var availableVersion = ImageMagick_1.getImageMagickVersion();
        switch (availableVersion) {
            case 6:
                options.interpolate = "bicubic";
                break;
            case 7:
                options.interpolate = "catrom";
                break;
            default:
                throw new UnsupportedError_1.UnsupportedError();
        }
    }
}