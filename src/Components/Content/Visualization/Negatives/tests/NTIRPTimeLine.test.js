import NTIRPTimeLine from '../NTIRPTimeLine';
import React from 'react';
import { render } from '@testing-library/react';
import 'jest-localstorage-mock';
import { JSDOM } from 'jsdom';

const mockedProps = {
    vnames: {8 : "test"},
    tirp: {
        elements: [[8],[8]],
        negatives: [false,true],
        durations: [1.0,15.381336127261717],
        gaps: [0.0]
    }
};

const MockedComponent = (props) => {
  return <NTIRPTimeLine {...mockedProps} {...props} />;
};

describe.only('NTIRPTimeLine', () => {
  beforeAll(() => {
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = jsdom.window;
    global.document = window.document;
    global.navigator = {
      userAgent: 'node.js',
    };
  });

  it('should render correctly', () => {
    const { container } = render(<MockedComponent />);
    expect(container).toMatchSnapshot();
  });

  it('check test', () => {
    const { container } = render(<MockedComponent />);
    expect(container).toHaveTextContent("test")
    });
});
