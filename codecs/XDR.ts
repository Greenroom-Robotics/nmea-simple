/*
 * === XDR - Heading Pitch and Roll===
 *
 * ------------------------------------------------------------------------------
 *                                       10         13        16
 *         1  2    3 4 5     6 7 8     9 |  11    12| 14    15| 17
 *         |  |    | | |     | | |     | |  |     | | |     | | |
 * $--XDR',A,272.8,D,A,272.8,D,A,+03.1,D,A,-000.4,D,C,+30.6,C,G,002*1C]
 * ------------------------------------------------------------------------------
 *
 * Field Number:
 *
 * 1.
 * 2. Heading
 * 3.
 * 4.
 * 5. Heading repeated
 * 6.
 * 7.
 * 8. Pitch (degrees)
 * 9.
 * 10.
 * 11. Roll (degrees)
 * 12.
 * 13.
 * 14. Sensor temperature
 * 15.
 * 16.
 * 17. Checksum
 */

import { createNmeaChecksumFooter, encodeDegrees, encodeFixed, parseFloatSafe } from "../helpers";


export const sentenceId: "XDR" = "XDR";
export const sentenceName = "Orientation - heading pitch and roll";


export interface XDRPacket {
    sentenceId: "XDR";
    sentenceName?: string;
    talkerId?: "HC";
    heading: number;
    pitch: number;
    roll: number;
    altimeterTemp: number;
}


export function decodeSentence(fields: string[]): XDRPacket {
    return {
        sentenceId: sentenceId,
        sentenceName: sentenceName,
        heading: parseFloatSafe(fields[2]),
        pitch: parseFloatSafe(fields[8]),
        roll: parseFloatSafe(fields[11]),
        altimeterTemp: parseFloatSafe(fields[14])
    };
}
