import "should";

import { parseNmeaSentence } from "../index";

describe("NIX", (): void => {
    describe("US,TR (NIX_REPLY)", (): void => {
        it("parser", (): void => {
            const packet = parseNmeaSentence("$PNIX,US,TR,7,0>31>0,7.196334,10794.502*0B");
            packet.should.have.property("sentenceId", "NIX_REPLY");
            packet.should.have.property("sequence", 7);
            packet.should.have.property("src", 0);
            packet.should.have.property("destinations", [31, 0]);
            packet.should.have.property("slant", 7.196334);
            packet.should.have.property("range", 10794.502);
        });
    });
    describe("US,RX (NIX_REPLY)", (): void => {
        it("parser", (): void => {
            const packet = parseNmeaSentence("$PNIX,US,RX,1,1592957559.497577,0.2,21.7,3,29.750000,45,17,0B15CB2B04CB006020008639,7,MASQ20,31>0,89.747576,134621.365*3C");
            packet.should.have.property("sentenceId", "NIX_RECEIVED");
            packet.should.have.property("selrx", 1);
            packet.should.have.property("receiveTime", 1592957559.497577);
            packet.should.have.property("dop", 0.2);
            packet.should.have.property("snr", 21.7);
            packet.should.have.property("err", 3);
            packet.should.have.property("transpondDelay", 29.75);
            packet.should.have.property("rxPower", 45);
            packet.should.have.property("rwMargin", 17);
            packet.should.have.property("data", "0B15CB2B04CB006020008639");
            packet.should.have.property("protocol", 7);
            packet.should.have.property("acousticBaudRate", "MASQ20");
            packet.should.have.property("src", 31);
            packet.should.have.property("destinations", [0]);
            packet.should.have.property("slant", 89.747576);
            packet.should.have.property("range", 134621.365);
        });
    });
});
