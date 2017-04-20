import React from "react";
import {render} from 'react-dom';

const Dot = (props) =>
  <span>.</span>;

class DotComponent extends React.Component {
  render() {
    return <span>.</span>;
  }
}

class Main extends React.Component {
  render() {
    var dots = Array(500).fill(0).map(x => {
      if(this.props.kind == 'stateless-functional-direct-call') {
        return Dot();
      } else if(this.props.kind == 'stateless-functional-mounted') {
        return React.createElement(Dot, {}, {});
      } else if(this.props.kind == 'stateful') {
        return React.createElement(DotComponent, {}, {});
      }
    })
    return React.createElement('div', {}, ...dots);
  }
}

let prevBenchmarkTime, benchmarkCount, statefulTotalTime, statelessFunctionalMountedTotalTime, statelessFunctionalDirectCallTotalTime;
benchmarkCount = 0;
statefulTotalTime = 0;
statelessFunctionalMountedTotalTime = 0;
statelessFunctionalDirectCallTotalTime = 0;

const run = () => {
  ['stateful', 'stateless-functional-mounted', 'stateless-functional-direct-call'].forEach(kind => {
    const prevTime = performance.now();

    var items = [];
    var i, len;
    for (i = 0, len = 20; i < len; i++) {
      items.push(i);
    }
    items.forEach(i => {
      render((
        <Main kind={kind}/>
        ), document.getElementById(kind));
    });

    const time = Math.round(performance.now() - prevTime);

    if(kind == 'stateless-functional-direct-call') {
      statelessFunctionalDirectCallTotalTime = statelessFunctionalDirectCallTotalTime + time
    } else if(kind == 'stateless-functional-mounted') {
      statelessFunctionalMountedTotalTime = statelessFunctionalMountedTotalTime + time
    } else if(kind == 'stateful') {
      statefulTotalTime = statefulTotalTime + time
    }

    const perf = (Math.round((1-time/prevBenchmarkTime)*100) || '  ')
    prevBenchmarkTime = time;
  })
  prevBenchmarkTime = undefined
  benchmarkCount = benchmarkCount + 1
  console.log('.')
  return
}

window.benchmark = (count=10) => {
  console.log(`Running %c${count} %ctimes ...`, 'font-weight: bold', 'font-weight: normal');
  Array(count).fill(0).forEach(x => run())
  console.log(`Stateful                         took ${statefulTotalTime}ms`);
  console.log(`Stateless Functional Mounted     took ${statelessFunctionalMountedTotalTime}ms %c${Math.round((1-statelessFunctionalMountedTotalTime/statefulTotalTime)*100)}% %c`, 'color:green', 'color:black');
  console.log(`Stateless Functional Direct Call took ${statelessFunctionalDirectCallTotalTime}ms %c${Math.round((1-statelessFunctionalDirectCallTotalTime/statefulTotalTime)*100)}% %c`, 'color:green', 'color:black');
  console.log(`%c🎉`, 'font-size: 100px')
}
