import React from 'react';
import XRayApi from '../../api/backend';
import h337 from 'heatmap.js';
import Slider from '@material-ui/core/Slider';
import { Button, Container } from '@material-ui/core';

class ImageSlider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbacks: null,
			webgazerTimestamp: [],
			gazeIndex: 0,
			gazeData: true,
			index: 0,
			marks: [],
			isAlertOpen: false,
			alertMessage: 'Blank message',
			alertSeverity: 'success'
		};
		 
	}

	alertOpen = openStatus => {
		this.setState({ isAlertOpen: openStatus });
		setTimeout(() => {
			this.setState({ isAlertOpen: false });
		}, 5000);
	};

	showAlert = (msg, severity = 'success') => {
		this.alertOpen(true);
		this.setState({ alertMessage: msg });
		this.setState({ alertSeverity: severity });
	};

	handleClickSlider=(e,newValue)=> {
		window.heatmap.setData({data:[]});
		this.setState({gazeIndex: newValue});
		
	}

	removeHeaderFooter () {
		var x = document.getElementsByTagName("header")[0];
		while(x!=null){
			
			x.parentNode.removeChild(x);
			var x = document.getElementsByTagName("header")[0];
		}
	}

	histogram(csvData) {
		var d3 = window.d3;
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 30, bottom: 30, left: 40},
			width = 460 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#histogram")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		// get the data
		d3.csv(csvData, function(data) {
			console.log(data)
		// X axis: scale and draw:
		var x = d3.scaleLinear()
			.domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
			.range([0, width]);
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));
		
		// set the parameters for the histogram
		var histogram = d3.histogram()
			.value(function(d) { return d.count; })   // I need to give the vector of value
			.domain(x.domain())  // then the domain of the graphic
			.thresholds(x.ticks(70)); // then the numbers of bins

		// And apply twice this function to data to get the bins.
		var bins1 = histogram(data.filter( function(d){return d.type === "variable 1"} ));
		var bins2 = histogram(data.filter( function(d){return d.type === "variable 2"} ));
		// Y axis: scale and draw:
		var y = d3.scaleLinear()
			.range([height, 0]);
			y.domain([0, 10]);   // d3.hist has to be called before the Y axis obviously
		svg.append("g")
			.call(d3.axisLeft(y));

		// append the bar rectangles to the svg element
		svg.selectAll("rect")
			.data(bins1)
			.enter()
			.append("rect")
				.attr("x", 1)
				.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
				.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
				.attr("height", function(d) { return height - y(d.length); })
				.style("fill", "#69b3a2")
			// .append("text")
			// 	.attr("dy", ".75em")
			// 	.attr("y", "6")
			// 	.attr("x", function(d) { return (x(d.x1))})
			// 	.attr("text-anchor", "middle")
			// 	.text(data[0].count )
			// 	.style("fill", "white");

		svg.selectAll("rect2")
			.data(bins2)
			.enter()
			.append("rect")
				.attr("x", 1)
				.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
				.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
				.attr("height", function(d) { return height - y(d.length); })
				.style("fill", "#404080")
				.style("opacity", 0.6)

		// Handmade legend
		svg.append("text").attr("x", 180).attr("y", 20).text("Fixation count on ").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("circle").attr("cx",180).attr("cy",40).attr("r", 6).style("fill", "#69b3a2")
		svg.append("circle").attr("cx",180).attr("cy",60).attr("r", 6).style("fill", "#404080")
		svg.append("text").attr("x", 200).attr("y", 40).text("Xray Image Viewer ").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 350).attr("y", 40).text(data[0].count).style("font-size", "25px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 200).attr("y", 60).text("Outside Image Viewer ").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 350).attr("y", 60).text(data[1].count).style("font-size", "25px").attr("alignment-baseline","middle")
		});
	}

	handleHistogram () {
		
		var flag = 1;
		var count = 0;
		var startTime = 0;
		var time = 0;
		var total = 0;
		var flag2 = 1;
		var start = 0;
		var time2 = 0;
		var totalTime = this.state.feedbacks["gazeData"][this.state.feedbacks["gazeData"].length-1].timestamp - this.state.feedbacks["gazeData"][0].timestamp;
		var x1 = this.state.feedbacks["xrayviewerCoodinates"].topLeftX;
		var y1 = this.state.feedbacks["xrayviewerCoodinates"].topLeftY;
		var x2 = this.state.feedbacks["xrayviewerCoodinates"].bottomRightX;
		var y2 = this.state.feedbacks["xrayviewerCoodinates"].bottomRightY;
		
		for(let i=0; i<this.state.feedbacks["gazeData"].length; i++) {
			var x = this.state.feedbacks["gazeData"][i].x*this.state.feedbacks["screenWidth"];
			var y = this.state.feedbacks["gazeData"][i].y*this.state.feedbacks["screenHeight"];
			
			if(x>=x1 && y>=y1 && x<=x2 && y<=y2) {
				// flag2 = 1;
				if(flag) {
					startTime = this.state.feedbacks["gazeData"][i].timestamp;
					
					count = count + 1;
					flag = 0;
				}
				// if(start!=0)
				// 	time2 = time2 + (this.state.feedbacks["gazeData"][i-1].timestamp - start);
			}
			else {
				flag = 1; 
				// if(flag2) {
					total = total + 1;
				// 	flag2 = 0;
				// }
				
				if(startTime!=0)
					time = time + (this.state.feedbacks["gazeData"][i-1].timestamp - startTime);
			}
		}
		let data = [];
		let columns = ["type","count", "time"];
		data.push(columns)
		data.push(["variable 1", count, time]);
		data.push(["variable 2", total, totalTime-time]);
		let csvContent = "data:text/csv;charset=utf-8," 
		+ data.map(e => e.join(",")).join("\n");
		this.histogram(csvContent);
		console.log(count, time/1000+'s', time2);
	}

	play (){
		
		var heatmapCanvas = document.querySelector('.heatmap-canvas');
		
		var screenshots = this.state.feedbacks["screenshots"];
		var timeout = 200;
		if(this.state.gazeIndex<this.state.webgazerTimestamp.length) {
			let start = this.state.gazeIndex;
			let image = new Image();
			
			let index = this.state.webgazerTimestamp[this.state.gazeIndex].screenshotIndex
			
			// image.src = screenshots[index].screenshot
			var url = screenshots[index].screenshot
			heatmapCanvas.style.backgroundImage = "url("+url+")";
			if(this.state.feedbacks["gazeData"][this.state.gazeIndex]){
				window.heatmap.addData({
					x: this.state.feedbacks["gazeData"][this.state.gazeIndex].x*window.screen.width,
					y: this.state.feedbacks["gazeData"][this.state.gazeIndex].y*window.screen.height,
				});
			}
			this.setState({gazeIndex: this.state.gazeIndex+1});
			var end = this.state.gazeIndex<this.state.webgazerTimestamp.length?this.state.gazeIndex:this.state.webgazerTimestamp.length-1;
			let h = this.state.webgazerTimestamp[start];
			timeout = this.state.webgazerTimestamp[end].timestamp - this.state.webgazerTimestamp[start].timestamp
		} 
		else{
			window.heatmap.setData({data:[]})
			this.setState({gazeIndex: 0});
		}
		
		setTimeout(z=>{this.play()}, timeout);
	}

	openFullscreen() {
		var elem = document.body;
		if (elem.mozRequestFullScreen) { /* Firefox */
		  elem.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			document.body.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
		  elem.msRequestFullscreen();
		}
	  }
	
	render() {
		
		this.openFullscreen();
		
		return (
			<Container>
		        <div  style={{marginTop: "20%", marginLeft: "75%"}} id="histogram"></div>
				<div >
                    <Button  style={{marginTop: "5%"}} variant="contained" color="primary" onClick={this.play.bind(this)}>Play</Button>
                </div>
				<br />
				<div >
					<Slider
						id='slider'
						max={this.state.webgazerTimestamp.length-1}
						onChange={this.handleClickSlider}
						aria-labelledby="discrete-slider-small-steps"
						step={1}
						value={this.state.gazeIndex}
						marks={this.state.marks}
					/>
				</div>
				
			
			</Container>
        )};
	getFeedbackById = (feedbackId) => {
        XRayApi.serveFeedbackById(feedbackId,this.apiResponse);
    };
    apiResponse = apiResponse => {

		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log(apiResponse.response.data.result[0]);
            this.setState({ feedbacks: apiResponse.response.data.result[0] });

			let image = new Image();
			// image.src = this.state.feedbacks["screenshots"][0].screenshot;
			var url = this.state.feedbacks["screenshots"][0].screenshot;
			var heatmapCanvas = document.querySelector('.heatmap-canvas');
			heatmapCanvas.style.backgroundImage = "url("+url+")";
			heatmapCanvas.style.backgroundRepeat = "no-repeat";
			var webgazerTimestamp = [];
			var k = 0;
			var marks = [];
            if(this.state.feedbacks["gazeData"].length!=0) {
				
			marks.push({value: 0, label: 0})
			webgazerTimestamp.push({timestamp: this.state.feedbacks["gazeData"][0].timestamp, screenshotIndex: k});
			for(let j=1;j<this.state.feedbacks["gazeData"].length;j++) {
				
				if(k+1<this.state.feedbacks["screenshots"].length) {
					if(this.state.feedbacks["screenshots"][k+1].timestamp<=this.state.feedbacks["gazeData"][j].timestamp){	
						k++;
						marks.push({value: j+1, label: k});
					}	
				}
				else 
					k=this.state.feedbacks["screenshots"].length-1;

				webgazerTimestamp.push({timestamp: this.state.feedbacks["gazeData"][j].timestamp, screenshotIndex: k});	
				
				
			}
			this.setState({webgazerTimestamp: webgazerTimestamp});
			this.setState({marks: marks});
			}
			else
				this.setState({gazeData: false});
			// this.handleHistogram();
		} else {
			console.log(apiResponse.response);
		}
	};
	componentWillMount(){
		
		let feedbackId = localStorage.getItem('feedbackid');
		localStorage.setItem('gazeIndex',0)
		this.getFeedbackById(feedbackId);
	}

	componentDidMount() {
		this.openFullscreen();
		this.removeHeaderFooter();
		
		window.heatmap = h337.create({
			container: document.body
		  });
		var heatmapCanvas = document.querySelector('.heatmap-canvas');
		heatmapCanvas.style.width = "100%";
		heatmapCanvas.style.height = "100%";
		
		var slider = document.getElementById('slider')
		slider.addEventListener('wheel',function(event) {
			window.heatmap.setData({data:[]});
			if(event.deltaY<0){
				let gazex = this.state.gazeIndex>0?this.state.gazeIndex-1:0;
				this.setState({gazeIndex: gazex});
			}
			else{
				let gazeIndex = this.state.gazeIndex<(this.state.webgazerTimestamp.length-1)?(this.state.gazeIndex+1):(this.state.webgazerTimestamp.length-1);
				this.setState({gazeIndex: gazeIndex});
			}
			}.bind(this));
		}
};

export default ImageSlider;
