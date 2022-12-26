import React, { Component } from 'react';
import Chart from 'react-google-charts';
import { Card } from 'react-bootstrap';
import service from './service.js';

class NTIRPTimeLine extends Component {
	defaultColors = ['#ff6347', '#ee82ee', '#ffa500', '#6a5acd', '#7f2b47', '#7fffe6', '#ffff10'];

	state = {
		classMode: 0,
	};

	computeColors() {
		const colorsFromSymbols = () =>
			this.symbols.map((symbol, idx) => {
				const colorsPerSymbol = {
					[this.props.prefixSymbol]: 'red',
					[this.props.nextSymbol]: 'green',
					[this.props.centerSymbol]: 'rgb(44, 64, 100)',
				};
				return colorsPerSymbol[symbol] || this.defaultColors[idx];
			});

		return this.props.colorIntervals ? colorsFromSymbols() : [];
	}

	timesToSymbols(times) {
		return times.map((time) => service.getDateForSymbol(time));
	}

	computeDataset = (isDiscriminative, classMode) => {
		const timesCls0 = this.props.tirp._TIRP__mean_offset_from_first_symbol;
		const timesCls1 = this.props.tirp._TIRP__mean_offset_from_first_symbol_class_1;

		const durationFirstIntervalCls0 = this.props.tirp._TIRP__mean_of_first_interval;
		const durationFirstIntervalCls1 = this.props.tirp._TIRP__mean_of_first_interval_class_1;

		const data = this.symbols.map((symbol, i) => {
			const offsetCls1 = durationFirstIntervalCls1;
			const offsetCls0 = durationFirstIntervalCls0;

			const [startTimeCls0, endTimeCls0, startTimeCls1, endTimeCls1] = this.timesToSymbols(
				i === 0
					? [0, offsetCls0, 0, offsetCls1]
					: [
							offsetCls0 + timesCls0[2 * i],
							offsetCls0 + timesCls0[2 * i + 1],
							offsetCls1 + timesCls1[2 * i],
							offsetCls1 + timesCls1[2 * i + 1],
					  ]
			);

			const durationCls0 = this.props.tirp._TIRP__exist_in_class0
				? service.getDiffBetweenDates(startTimeCls0, endTimeCls0)
				: '0';
			const durationCls1 = this.props.tirp._TIRP__exist_in_class1
				? service.getDiffBetweenDates(startTimeCls1, endTimeCls1)
				: '0';
			const duration = isDiscriminative ? `${durationCls0} / ${durationCls1}` : durationCls0;

			const intervalCls1 = [startTimeCls1, endTimeCls1];
			const intervalCls0 = [startTimeCls0, endTimeCls0];
			const [startTime, endTime] = classMode === 1 ? intervalCls1 : intervalCls0;

			return [symbol, `${symbol} - ${duration}`, startTime, endTime];
		});

		return [
			[
				{ type: 'string', id: 'Term' },
				{ type: 'string', id: 'Name' },
				{ type: 'date', id: 'Start' },
				{ type: 'date', id: 'End' },
			],
			...data,
		];
	};

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }


    computeNDataset = (elements, negatives, timezone, gap) => {
        const columns = [
            { type: "string", id: "Elements" },
            { type: "number", id: "Start" },
            { type: "number", id: "End" },
        ];

        const dataset = []
        let startTime = 0
        for(let i = 0; i< elements.length; i++) {
            const endTime = startTime + (timezone[i] * 1000)
			if (elements[i].length > 1) {
				for(let j = 0; j< elements[i].length; j++) {
					const row = [String(elements[i][j]), startTime, endTime]
					dataset.push(row)
				}
			} else {
				if (negatives[i]) {
					const row = [String.fromCharCode(172) + String(elements[i]), startTime, endTime]
					dataset.push(row)
				} else {
					const row = [String(elements[i]), startTime, endTime]
					dataset.push(row)
				}
			}
			startTime = endTime + (gap[i] * 1000)
        }
        const data = [columns, ...dataset];
        return data

		};
	render() {
		const elements = this.props.tirp.elements;
		const negatives = this.props.tirp.negatives;
		const timezone = this.props.tirp.durations;
		const gap = this.props.tirp.gaps;
		const dataset = this.computeNDataset(elements, negatives, timezone, gap);
		const intervals = dataset.slice(1);
        const options = {
            hAxis: {
              ticks: intervals.map(([label, start, end]) => [start, end]),
            },
			annotations: {
				0: {
					style: 'circle'
				},
			}
          };
        // const intervals = dataset.slice(1);
        // const ticks = intervals.flatMap((interval) => interval.slice(1, 3));
		// const colors = this.computeColors();
		// const intervals = dataset.slice(1);
		// const ticks = intervals.flatMap((interval) => interval.slice(2, 4));
		// const hasHours = ticks.find((tick) => tick.getHours() > 0);
		console.log("intervals: "+ intervals)
		console.log("TICKS: " + options.hAxis.ticks)
		return (
			<div>
				<Card>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Mean Presentation
						</Card.Text>
					</Card.Header>
					<Card.Body>
						<Chart
							height={'200px'}
							chartType='Timeline'
							loader={<div>Loading Chart</div>}
							data={dataset}
                            options={options}
						/>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default NTIRPTimeLine;
