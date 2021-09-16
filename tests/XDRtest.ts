import "should";

import { encodeNmeaPacket, parseNmeaSentence } from "../index";


describe("XDR", (): void => {

  it("parser", (): void => {
    const packet = parseNmeaSentence("$HCXDR,A,272.3,D,A,272.3,D,A,+03.3,D,A,-000.5,D,C,+30.6,C,G,002*1F");

    packet.should.have.property("sentenceId", "XDR");
    packet.should.have.property("sentenceName", "Orientation - heading pitch and roll");
    packet.should.have.property("talkerId", "HC");
    packet.should.have.property("heading", 272.3);
    packet.should.have.property("pitch", 3.3);
    packet.should.have.property("roll", -0.5);
    packet.should.have.property("altimeterTemp", 30.6);

  });
});
