// Internet Explorer 11 requires polyfills and partially supported by this project.
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'typeface-muli';
import './i18n';
import './react-chartjs-2-defaults';
import './styles/index.css';
import App from 'app/App';
import * as serviceWorker from './serviceWorker';
import h337 from 'heatmap.js';
import ControlledExpansionPanels from 'app/main/example/components/pages/FeedbackList';
// import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
ReactDOM.render(<App />, document.getElementById('root'));
window.saveDataAcrossSessions = true;
window.applyKalmanFilter = true;
window.heatmap = h337.create({
	container: document.body
  });
console.log(window.predictions)
window.predictions = [];

window.webgazer
	.setTracker('clmtrackr')
	.setGazeListener(function(data, clock) {
		if (data) {
		// window.heatmap.addData({
		// 	x: data.x,
		// 	y: data.y,
		// });
		window.predictions.push({x: data.x/window.screen.width,y: data.y/window.screen.height, timestamp: Date.now().toString()});
		// console.log(predictions);
		}
		// console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
		// console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
	})

document.addEventListener('keydown', event => {
	var heatmapCanvas = document.querySelector('.heatmap-canvas');
	var Rkey = 82;
	var Skey = 83;
	var Vkey = 86;
	var Hkey = 72;
	if (event.isComposing || (event.keyCode === Skey && event.shiftKey))
	{
		window.webgazer
			.begin()
			.showVideo(!window.webgazer.params.showVideo)
			.showPredictionPoints(!window.webgazer.params.showGazeDot)
			.showFaceOverlay(!window.webgazer.params.showFaceOverlay)
			.showFaceFeedbackBox(!window.webgazer.params.showFaceFeedbackBox);
		// heatmapCanvas.style.zIndex = -1;
	}
	if (event.isComposing || (event.keyCode === Vkey && event.shiftKey)) {
		console.log(event.key);
		window.webgazer.params.showVideo = !window.webgazer.params.showVideo;
		window.webgazer.params.showFaceOverlay = !window.webgazer.params.showFaceOverlay;
		window.webgazer.params.showFaceFeedbackBox = !window.webgazer.params.showFaceFeedbackBox;
		// window.webgazer.params.showGazeDot = !window.webgazer.params.showGazeDot;
		window.webgazer
			.showVideo(window.webgazer.params.showVideo)
			.showPredictionPoints(window.webgazer.params.showGazeDot)
			.showFaceOverlay(window.webgazer.params.showFaceOverlay)
			.showFaceFeedbackBox(window.webgazer.params.showFaceFeedbackBox);
			
		var video = document.getElementById('webgazerVideoFeed');
		if (video){
			video.style.zIndex = 99999;
			var video = document.getElementById('webgazerFaceFeedbackBox');
			video.style.zIndex = 99999;
			var video = document.getElementById('webgazerVideoCanvas');
			video.style.zIndex = 99999;
			var video = document.getElementById('webgazerFaceOverlay');
			video.style.zIndex = 99999;
		}
	} 
	if (event.isComposing || (event.keyCode === Rkey && event.shiftKey)) {
		window.webgazer.showPredictionPoints(!window.webgazer.params.showGazeDot);
	}

	if(event.isComposing || (event.keyCode === Hkey && event.shiftKey)){
		console.log('hpressed');
		if(Number(heatmapCanvas.style.zIndex) === -1 || heatmapCanvas.style.zIndex === ""){
			heatmapCanvas.style.zIndex = 99999
		} else{
			heatmapCanvas.style.zIndex =-1;
		}
	}
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
