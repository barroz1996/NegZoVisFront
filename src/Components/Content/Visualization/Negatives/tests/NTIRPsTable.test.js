import React from 'react';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import NTIRPsTable from '../NTIRPsTable'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-localstorage-mock';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

const props = {
  ntable: {NegativeData: [{"durations":[1.0,15.381336127261717],"elements":[[8],[8]],"gaps":[0.0],"mean horizontal support":2.794022790797678,"mean mean duration":16.381336127261733,"negatives":[false,true],"support":4651},
  {"durations":[1.0,10.719659081750578],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.7938077832724146,"mean mean duration":11.719659081750569,"negatives":[false,true],"support":4651},
  {"durations":[1.0],"elements":[[8]],"gaps":[],"mean horizontal support":2.794022790797678,"mean mean duration":1.0,"negatives":[false],"support":4651},
  {"durations":[1.0,16.065497515127483],"elements":[[18],[18]],"gaps":[0.0],"mean horizontal support":2.1912580943570767,"mean mean duration":17.065497515127486,"negatives":[false,true],"support":4324},
  {"durations":[1.0],"elements":[[18]],"gaps":[],"mean horizontal support":2.192094313453537,"mean mean duration":1.0,"negatives":[false],"support":4326},
  {"durations":[5.648990156899009,1.0,15.409204292381236],"elements":[[18],[8],[8]],"gaps":[0.0,0.0],"mean horizontal support":2.38248436103664,"mean mean duration":22.058194449280204,"negatives":[true,false,true],"support":4476},
  {"durations":[5.647649674325282,1.0,10.224972589097929],"elements":[[18],[8],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.382260947274352,"mean mean duration":16.87262226342322,"negatives":[true,false,true],"support":4476},
  {"durations":[5.648990156899009,1.0],"elements":[[18],[8]],"gaps":[0.0],"mean horizontal support":2.38248436103664,"mean mean duration":6.648990156899009,"negatives":[true,false],"support":4476},
  {"durations":[2.66390407],"elements":[[18]],"gaps":[],"mean horizontal support":2.5339389784024684,"mean mean duration":2.66390407,"negatives":[true],"support":5834},
  {"durations":[3.2364430798851314,1.0,16.0646683449945],"elements":[[8],[18],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.1908396946564888,"mean mean duration":20.30111142487965,"negatives":[true,false,true],"support":4323},
  {"durations":[3.23989443568634,1.0],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.1916763005780346,"mean mean duration":4.239894435686342,"negatives":[true,false],"support":4325},
  {"durations":[2.27890518],"elements":[[8]],"gaps":[],"mean horizontal support":3.115872471717518,"mean mean duration":2.27890518,"negatives":[true],"support":5834}]},
};

const emptyProps = {
  ntable : {NegativeData: []}
}

// Mock the window.pathOfTirps property
const mockPathOfTirps = {};
Object.defineProperty(window, 'pathOfTirps', {
  value: mockPathOfTirps,
  writable: true,
});

// Mock the NTirpMatrix component
jest.mock('../NTirpMatrix', () => {
  const NTirpMatrixMock = () => <div>NTirpMatrix</div>;
  return NTirpMatrixMock;
});

// Mock the NTIRPTimeLine component
jest.mock('../NTIRPTimeLine', () => {
  const NTIRPTimeLineMock = () => <div>NTIRPTimeLine</div>;
  return NTIRPTimeLineMock;
});

const localStorageMock = {
  rootElement: props.ntable,
  negative: true,
  VMapFile: {
    8: 'A',
    18: 'B',
  },
  num_of_entities: 0,
  num_of_entities_class_1: 0,
  PassedFromSearch: 'false',
  min_ver_support: 0.5,
};

describe('Component', () => {
  let wrapper;
  beforeAll(() => {
    window.open = jest.fn();
    global.localStorage = localStorageMock;
  });

  beforeEach(() => {
    JSON.parse = jest.fn().mockReturnValueOnce(props.ntable).mockReturnValueOnce(localStorageMock.VMapFile)
    wrapper = mount(<NTIRPsTable {...props}/>);
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render the table headers', () => {
    expect(wrapper.find('th').at(0).text()).toEqual('Next');
    expect(wrapper.find('th').at(1).text()).toEqual('P/N');
    expect(wrapper.find('th').at(2).text()).toEqual('Relation');
    expect(wrapper.find('th').at(3).text()).toEqual('Symbol');
    expect(wrapper.find('th').at(4).text()).toEqual('VS0');
    expect(wrapper.find('th').at(5).text()).toEqual('MHS0');
    expect(wrapper.find('th').at(6).text()).toEqual('MMD0');
  });

  it('should render the table rows', () => {
    expect(wrapper.find('td').at(1).text()).toEqual('Positive');
    expect(wrapper.find('td').at(2).text()).toEqual('-');
    expect(wrapper.find('td').at(3).text()).toEqual('A');
    expect(wrapper.find('td').at(4).text()).toEqual('4651');
    expect(wrapper.find('td').at(5).text()).toEqual('2.79');
  });

  it('should render the Selected Table headers', () => {
    expect(wrapper.find('th').at(7).text()).toEqual('Metric');
    expect(wrapper.find('th').at(8).text()).toEqual('Value');
  });

  it('should render the Selected Table rows', () => {
    expect(wrapper.find('th').at(9).text()).toEqual('Current level');
    expect(wrapper.find('th').at(10).text()).toEqual('Vertical support');
    expect(wrapper.find('th').at(11).text()).toEqual('Mean horizontal_support');
    expect(wrapper.find('th').at(12).text()).toEqual('Mean mean duration');
    expect(wrapper.find('th').at(13).text()).toEqual('Entities');
  });
});
