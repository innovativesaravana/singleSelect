import jsdom from "jsdom";
import chai from "chai";
import { expect } from "chai";
import sinon from "sinon";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import chaiEnzyme from "chai-enzyme";
chai.use(chaiEnzyme());

const doc = jsdom.jsdom("<!DOCTYPE html><html><body></body></html>");
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.expect = expect;

Object.keys(window).forEach(key => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});
