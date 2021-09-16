/*
 * === PNIX - L3 GPM300 Sonar Modem ===
 *
 * Received Message
 * ------------------------------------------------------------------------------
 *       1  2  3        4                    5     6    7
 *       |  |  |        |                    |     |    |
 * $PNIX,US,TR,sequence,src>dst1..>dst(2N-1),slant,range*cs<cr> <lf>
 * ------------------------------------------------------------------------------
 *
 *
 * Reply: (Remote Acknowledge)
 * ------------------------------------------------------------------------------
 *       1  2  3     4        5   6   7   8        9      10     11   12   13       14               15    16    17
 *       |  |  |     |        |   |   |   |        |      |      |    |    |        |                |     |     |
 * $PNIX,US,RX,selrx,r.rrrrrr,dop,snr,err,d.dddddd,rx_pwr,rx_mgm,data,prot,acoustic,src>dst1...>dstN,slant,range *cs<cr><lf

 */

import { parseFloatSafe, parseIntSafe, parseSrcDestinations } from "../helpers";

const sentenceName = "L3 GPM300 Sonar Modem Message";

/**
 * Reply: (Remote Acknowledge)
 *
 * Reply from one or more modems.
 */
export interface NIXPacketReply {
    sentenceId: "NIX_REPLY";
    sentenceName: string;
    talkerId?: string;
    /** Message message sequence number */
    sequence: number;
    /** Source (From) Address */
    src: number;
    /** Destinations */
    destinations: number[];
    /** Total transpond slant time (seconds) measurement from the first to the last destination addresses */
    slant?: number;
    /** Total transpond slant range (meters) measurement between the first to last destination addresses calculated using the local sound speed. */
    range?: number;
}

/**
 * Received Message
 *
 * This is the message used by the modem to output a received message and
 * associated statistics.
 * If this message was received via a network routing command then routing address
 * path is append to the end of message. The number of destination address is variable
 * depending on the number intermediate nodes. The source/destination path
 */
export interface NIXPacketReceived {
    sentenceId: "NIX_RECEIVED";
    sentenceName: string;
    talkerId?: string;
    /**
     * Selected Receiver #
     *
     * 1=GPM300 (Default RX),
     * 1 to 6 = UT3000M/H.
     * 1 to N = PC/ATOM/ARM.
     */
    selrx: number;
    /**
     * Receive Time (µs resolution)
     *
     * 0.000000 to 255.999999
     */
    receiveTime: number;
    /**
     * Doppler (knots)
     */
    dop: number;
    /**
     * SNR (0.1 dB resolution)
     */
    snr: number;
    /**
     * Corrected Errors
     *
     * -1, 0...63 (-1 indicates corruption)
     */
    err: number;
    /**
     * Transmit data (µs resolution)
     *
     * 0 = No time of flight available.
     * 0.5, 1.0, 1.5 ..10 = Transpond delay
     * 0.000001 to 255.999999 =
     * Mod(256) transmit time.
     */
    transpondDelay: number;
    /**
     * Average in-band Rx Power in
     *
     * dB re 1microPa/ √ Hz SPL (0.1 dB res)
     */
    rxPower: number;
    /**
     * Receive Margin (0.1 dB)
     *
     * 3dB = Marginal link.
     * 6dB = Good link
     * 9dB= Very good, reduce TX power by 3dB
     * 12dB= Can double communicationrange.
     * 18dB= Can triple communication range.
     * 24dB= Can quadruple communication range.
     */
    rwMargin: number;
    /**
     * Message Data
     *
     * Base64 encoded characters [3]
     * (up to 1024 characters, RFC 4648)
     * See B.1.
     */
    data: string;
    /**
     * Message Protocol #
     *
     * 0...4 (see Appendix D)
     */
    protocol: number;
    /**
     * Acoustic baudrate
     *
     * MASQ10, MASQ20, MASQ50,
     * MASQ100, MASQ150, MASQ200,
     * MASQ350, MASQ500, MASQ750,
     * MASQ1000, MASQ1200 (HAIL1to
     * HAIL5
     */
    acousticBaudRate?: string;
    /**
     * Source (From) Address
     */
    src: number;
    /**
     * Destinations
     */
    destinations: number[];
    /**
     * Total transpond slant (seconds)
     * time measurement from the first
     * to the last destination addresses
     */
    slant?: number;
    /**
     * Total transpond slant (meters)
     * range measurement between
     * the first to last destination
     * addresses calculated using the
     * local sound speed.
     */
    range?: number;
}

export type NIXPacket = NIXPacketReply | NIXPacketReceived;

function decodeSentenceUS_TR(fields: string[]): NIXPacketReply {
    return {
        sentenceId: "NIX_REPLY",
        sentenceName: sentenceName,
        sequence: parseIntSafe(fields[3]),
        ...parseSrcDestinations(fields[4]),
        slant: parseFloatSafe(fields[5]),
        range: parseFloatSafe(fields[6])
    };
}

function decodeSentenceUS_RX(fields: string[]): NIXPacketReceived {
    return {
        sentenceId: "NIX_RECEIVED",
        sentenceName: sentenceName,
        selrx: parseIntSafe(fields[3]),
        receiveTime: parseFloatSafe(fields[4]),
        dop: parseFloatSafe(fields[5]),
        snr: parseFloatSafe(fields[6]),
        err: parseFloatSafe(fields[7]),
        transpondDelay: parseFloatSafe(fields[8]),
        rxPower: parseFloatSafe(fields[9]),
        rwMargin: parseFloatSafe(fields[10]),
        data: fields[11], // Buffer.from(data, 'base64').toString('ascii'),
        protocol: parseIntSafe(fields[12]),
        acousticBaudRate: fields[13],
        ...parseSrcDestinations(fields[14]),
        slant: parseFloatSafe(fields[15]),
        range: parseFloatSafe(fields[16])
    };
}

export function decodeSentence(fields: string[]): NIXPacket {
    if (fields[1] === "US" && fields[2] === "TR") {
        return decodeSentenceUS_TR(fields);
    }
    if (fields[1] === "US" && fields[2] === "RX") {
        return decodeSentenceUS_RX(fields);
    }
    throw Error(`No known parser for ${fields[1]} ${fields[2]}.`);
}
