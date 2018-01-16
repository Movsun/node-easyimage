/*
 EasyImage

 EasyImage is a promise-based image processing module
 for Node.js, it is built on top of ImageMagick, so
 make sure ImageMagick is installed on your system.

 Copyright (c) 2015 Hage Yaapa <http://www.hacksparrow.com>
 Maintained by Kevin Gravier <http://github.com/mrkmg>

 MIT License
 */

import * as Bluebird from "bluebird";
import {ensureDestinationDirectoryExists, applyDefaultsToBaseOptions, applyBaseOptionsToArgs} from "../Utilities";
import {execute} from "../ImageMagick";
import {info, IInfoResult} from "./info";
import {ICropOptions} from "./crop";
import {IResizeOptions} from "./resize";

Promise = Promise || Bluebird as any;

/**
 * Resizes and crops an image.
 *
 * @param {IResCropOptions} options
 * @returns {Bluebird<IInfoResult>}
 */
export async function rescrop(options: IResCropOptions): Promise<IInfoResult> {
    applyDefaultsToBaseOptions(options);
    upgradeCropOptions(options);
    applyDefaultsToRescropOptions(options);

    await ensureDestinationDirectoryExists(options);

    const args: string[] = [options.src];

    applyBaseOptionsToArgs(options, args);

    const cropDefinition = options.cropWidth + "x" + options.cropHeight + "+" + options.x + "+" + options.y;
    const resizeDefinition = `${options.width}x${options.height ? options.height : ""}${options.ignoreAspectRatio ? "!" : ""}`;

    if (options.gravity) {
        args.push("-gravity", options.gravity);
    }

    args.push("-resize", resizeDefinition, "-crop", cropDefinition, options.dst);

    await execute("convert", args);
    return info(options.dst);
}

export interface IResCropOptions extends ICropOptions, IResizeOptions {

}

function upgradeCropOptions(options: ICropOptions) {
    if (!options.cropWidth && options.cropwidth) {
        options.cropWidth = options.cropwidth;
    }

    if (!options.cropHeight && options.cropheight) {
        options.cropHeight = options.cropheight;
    }
}

function applyDefaultsToRescropOptions(options: IResCropOptions) {
    if (!options.cropHeight) {
        options.cropHeight = options.cropWidth;
    }
    if (!options.x) {
        options.x = 0;
    }
    if (!options.y) {
        options.y = 0;
    }
}