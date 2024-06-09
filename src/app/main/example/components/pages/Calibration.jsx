import React, { Component, createRef } from 'react';
import { validateAccessToken } from "../../api/utilities"
import navbar from 'app/store/reducers/fuse/navbar.reducer';
import swal from 'sweetalert';
import $ from 'jquery';
import 'styles/Calibration.css';
import 'styles/bootstrap.min.css';
import { API_BASE_URL_LOCAL } from '../../api/backend';
import Modal from 'react-bootstrap/Modal'
import Joyride, { ACTIONS, CallBackProps, STATUS, Step, StoreHelpers } from 'react-joyride';
var PointCalibrate = 0;
var CalibrationPoints={};
var imgUrl = "https://raw.githubusercontent.com/namwkim/bubbleview/master/img/sample3.jpg";
const steps = [
	{
      target: 'body',
      title: 'Step 2: Proceed to Calibration',
      content: 'Click the blue button if your face has adjusted perfectly.',
      placement: 'center'
	}
  ];
class Calibration extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    console.log(this.props)
    this.state = {
      open: true,
      run: false,
      show: false,
      opengif: false
    }
    this.ClearCanvas = this.ClearCanvas.bind(this);
    this.ShowCalibrationPicture = this.ShowCalibrationPicture.bind(this);
    this.startBlur = this.startBlur.bind(this);
  }

  componentWillMount() {
    // alert(document.fullscreenEnabled);
    var elem = document.body;
    // elem.dispatchEvent(new KeyboardEvent('keypress',{'key':'F11'}));
    if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {/* Chrome, Safari & Opera */
      document.body.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
  componentDidMount(){
    let elementsHeader = document.getElementsByClassName('MuiToolbar-root-50');
    while(elementsHeader.length > 0){
      elementsHeader[0].parentNode.removeChild(elementsHeader[0]);
    }
    let elements = document.getElementsByClassName('MuiPaper-root-151');
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
    
  }
  showGIF=()=>{
    this.setState({opengif: true});
  }
  /**
    * Load this function when the index page starts.
    * This function listens for mousemove  on the html page
    * checks for 400 points from mousemove, and then goes on to measuring the precision
  */
  startBlur(){
    this.ClearCanvas();
    // helpModalShow();
    
    $("#plotting_canvas").mousemove((event)=>{
      // click event on the calibration buttons
      if(PointCalibrate<=200) {
        var canvas = document.getElementById("plotting_canvas");
        var ctx = canvas.getContext("2d");
        
        ctx.save();
        var rect = canvas.getBoundingClientRect();
        ctx.filter="blur(0px)";
        var img = new Image();
        img.src = 'calibration.jpg';
        
        event.preventDefault();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        
        //draw the bubble
        ctx.beginPath();
        ctx.arc(x, y, 90, 0, 6.28, false);
        ctx.clip();
        ctx.drawImage(img,0,0, canvas.width, canvas.height);
        ctx.arc(x, y, 70, 0, 2 * Math.PI, false);
        ctx.strokeStyle = '#ff0000';
        
        ctx.closePath();

        ctx.restore();

        this.ShowCalibrationPicture();
        
        PointCalibrate++;
      
      }else {
        $("#plotting_canvas").unbind("mousemove");
        
        setTimeout(() =>{
          // last point is calibrated
          
          $("#image").hide();
          // clears the canvas
          var canvas = document.getElementById("plotting_canvas");
          var context = canvas.getContext('2d');
          
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          $("#Pt5").show();
        },2000);
          setTimeout(() =>{
              // notification for the measurement process
              swal({
                title: "Step 3: Calculating measurement",
                text: "Please stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
                closeOnEsc: false,
                allowOutsideClick: false,
                closeModal: true
              }).then( isConfirm => {

                  // makes the variables true for 5 seconds & plots the points
                  $(document).ready(()=>{
                    
                    this.store_points_variable(); // start storing the prediction points

                    this.sleep(5000).then(() => {
                        
                        this.stop_storing_points_variable(); // stop storing the prediction points
                        var past50 = this.get_points(); // retrieve the stored points
                        var precision_measurement = this.calculatePrecision(past50);
                        let msg = "";
                        if(precision_measurement>=70) msg = "Your accuracy measure is " + precision_measurement + "%. You are ready to proceed."
                        else msg = "Your accuracy measure is " + precision_measurement + "%. Please recalibrate for better performance.";
                        var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                        // document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                        swal({
                          title: "Step 4: End of Calibration",
                          text: msg,
                          allowOutsideClick: false,
                          buttons: {
                            cancel: "Recalibrate",
                            confirm: "Proceed to survey",
                          }
                        }).then(isConfirm => {
                            if (isConfirm){
                              //clear the calibration & hide the last middle button
                              
                              this.ClearCanvas();
                              localStorage.setItem('eyeTrack', true);
                              var dcmId  = localStorage.getItem('dcmId');
                              localStorage.setItem('guidedTour', true);
                              var url = '/xrayviewer?input=' + API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
                              // history.push(url);
                              window.location.replace(url);
                              // window.webgazer.end();
                              
                            } else {
                              //use restart function to restart the calibration
                              // Restart();
                              // ClearCalibration();
                              // ClearCanvas();
                              // Restart();
                              window.location.replace('/calibration');
                              // ShowCalibrationPicture();
                            }
                        });
                      });
                  });
                });
          },4000)
        }
      });   
    }
    /**
     * Show the Calibration Points
     */
    
    ShowCalibrationPicture() {
      
      var canvas = document.getElementById("plotting_canvas");
      var ctx = canvas.getContext("2d");
      
      ctx.filter = "blur(10px)";
      var img = new Image();
      img.onload = function(){
        ctx.drawImage(img,0,0, canvas.width, canvas.height);
      };
      img.src = 'calibration.jpg';
      
    }
    
    /**
    * This function clears the calibration buttons memory
    */
    ClearCalibration(){
      
    //   window.localStorage.clear();
      CalibrationPoints = {};
      PointCalibrate = 0;
    }
    
    // sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }     
    store_points_variable(){
        window.store_points_var = true;
      }
    /*
      * Sets store_points to false, so prediction points aren't
      * stored any more
    */
    stop_storing_points_variable(){
        window.store_points_var = false;
      }
      
      /*
       * Returns the stored tracker prediction points
       */
    get_points() {
        var past50 = new Array(2);
        past50[0] =  window.xPast50;
        past50[1] =  window.yPast50;
        return past50;
      }
      /*
     * This function calculates a measurement for how precise 
     * the eye tracker currently is which is displayed to the user
     */
    calculatePrecision(past50Array) {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
      
        // Retrieve the last 50 gaze prediction points
        var x50 = past50Array[0];
        var y50 = past50Array[1];
      
        // Calculate the position of the point the user is staring at
        var staringPointX = windowWidth / 2;
        var staringPointY = windowHeight / 2;
      
        var precisionPercentages = new Array(50);
        this.calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
        var precision = this.calculateAverage(precisionPercentages);
      
        // Return the precision measurement as a rounded percentage
        return Math.round(precision);
      };
      
      /*
       * Calculate percentage accuracy for each prediction based on distance of
       * the prediction point from the centre point (uses the window height as
       * lower threshold 0%)
       */
      calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
        for (let x = 0; x < 50; x++) {
          // Calculate distance between each prediction and staring point
          var xDiff = staringPointX - x50[x];
          var yDiff = staringPointY - y50[x];
          var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
      
          // Calculate precision percentage
          var halfWindowHeight = windowHeight / 2;
          var precision = 0;
          if (distance <= halfWindowHeight && distance > -1) {
            precision = 100 - (distance / halfWindowHeight * 100);
          } else if (distance > halfWindowHeight) {
            precision = 0;
          } else if (distance > -1) {
            precision = 100;
          }
          // Store the precision
          precisionPercentages[x] = precision;
        }
      }
      /*
       * Calculates the average of all precision percentages calculated
       */
      calculateAverage(precisionPercentages) {
        var precision = 0;
        for (let x = 0; x < 50; x++) {
          precision += precisionPercentages[x];
        }
        precision = precision / 50;
        return precision;
}
  /**
   * Clear the canvas and the calibration button.
  */
  ClearCanvas(){
    $("#Pt5").hide();
    var canvas = document.getElementById("plotting_canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
    
    render() {

      //start the webgazer tracker
      window.webgazer.setRegression('ridge') /* currently must set regression and tracker */
          .setTracker('clmtrackr')
          .setGazeListener(function(data, clock) {
              // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
              // console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
          })
          .begin()
          .showPredictionPoints(false)
          .showVideo(true)
          .showFaceOverlay(true)
          .showFaceFeedbackBox(true);; /* shows a square every 100 milliseconds where current prediction is */
  
      //Set up the webgazer video feedback.
      var setup = function() {
          //Set up the main canvas. The main canvas is used to calibrate the webgazer.
          var canvas = document.getElementById("plotting_canvas");
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          canvas.style.position = 'fixed';
      };

      function handleClose(){
        this.setState({open: false});
        // this.setState({run: true});
        Restart();
      }

      function handleCloseGif(){
        this.setState({opengif: false});
        PopUpInstruction();
      }

      function checkIfReady() {
          if (window.webgazer.isReady()) {
              setup();
          } else {
              setTimeout(checkIfReady, 100);
          }
      }
      setTimeout(checkIfReady,100);
      handleCloseGif = handleCloseGif.bind(this);
      handleClose = handleClose.bind(this);
    /**
     * Restart the calibration process by clearing the local storage and reseting the calibration point
     */
    function Restart(){
      
        localStorage.setItem('eyeTrack',false)
        // document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
        this.ClearCalibration();
        $("#calibrate").click(function(){
            // StopJoyride();
            // setTimeout(()=>{
              $(this).fadeOut();
            // var video = document.getElementById('webgazerVideoCanvas');
            // video.style.display = 'none';
            // var video = document.getElementById('webgazerVideoFeed');
            // video.style.display = 'none';
            // var video = document.getElementById('webgazerFaceOverlay');
            // video.style.display = 'none';
            // var video = document.getElementById('webgazerFaceFeedbackBox');
            // video.style.display = 'none';
            // PopUpInstruction();
            // }, 1000)
        });
    }
    
    Restart = Restart.bind(this);

    /**
     * Show the instruction of using calibration at the start up screen.
     */
    function PopUpInstruction(){
      this.ClearCanvas();
      // swal({
      //   title:"Calibration",
      //   text: "Please move your mouse to get clear view. You must move on all corner points and middle. This will calibrate your eye movements.",
      //   buttons:{
      //     cancel: false,
      //     confirm: true
      //   }
      // }).then(isConfirm => {
        this.ShowCalibrationPicture();
        this.startBlur();
      // });
    
    }
    PopUpInstruction =PopUpInstruction.bind(this);
    function StopJoyride(){
      this.setState({run: false}); 
    }
    StopJoyride = StopJoyride.bind(this);
    /**
      * Show the help instructions right at the start.
      */
    function helpModalShow() {
        // $("#helpModal").modal('show');
        swal({
            title:"Calibration",
            text: "Click ok to Calibrate.",
            buttons:{
            cancel: false,
            confirm: true
            }
        }).then(isConfirm => {
            Restart();
            // move=true;
        });
    }
        return (
            
        <div>
          <div style={{backgroundColor: "transparent"}}>
            <Modal
              show={this.state.open}
              onHide={x=>{handleClose();}}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
              centered
            >
              <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                Step 1: Adjust Eye Tracker
              </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <img src='calibration.png'></img>
              </Modal.Body>
            </Modal>
            </div>
            <Modal
              show={this.state.opengif}
              onHide={x=>{handleCloseGif();}}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
              centered
            >
              <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
              Step 2: Next a blur view will appear on your screen. Look at the cursor while moving your mouse to get clear view.
              </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <img src='cal.gif'></img>
              </Modal.Body>
            </Modal>
            <Joyride
              continuous={false}
              run={this.state.run}
              scrollToFirstStep={false}
              showProgress={false}
              showSkipButton={true}
              steps={steps}
              // stepIndex={this.state.stepIndex}
              styles={{
                options: {
                zIndex: 10000,
                },
              }}
            />
            
            <div id="canvasDiv">
            <canvas id="plotting_canvas" width="500" height="500" style={{cursor:"crosshair"}}></canvas>
            </div>
            {/* <div id="Accuracy">
            <a>Not yet Calibrated</a> */}
                {/* <nav id="webgazerNavbar" class="navbar navbar-default navbar-fixed-top"> */}
                    {/* <div class="container-fluid"> */}
                        {/* <div class="navbar-header"> */}
                            {/* The hamburger menu button  */}
                            {/* <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar"> */}
                            {/* <span class="icon-bar"></span> */}
                            {/* <span class="icon-bar"></span> */}
                            {/* <span class="icon-bar"></span> */}
                            {/* </button> */}
                        {/* </div> */}
                        {/* <div class="collapse navbar-collapse" id="myNavbar"> */}
                            {/* <ul class="nav navbar-nav"> */}
                            {/* <!-- Accuracy --> */}
                            {/* <li id="Accuracy"><a>Not yet Calibrated</a></li> */}
                            {/* <li onclick="Restart()"><a href="#">Recalibrate</a></li> */}
                            {/* </ul> */}
                            {/* <ul class="nav navbar-nav navbar-right"> */}
                            {/* <li><button class="helpBtn" data-toggle="modal" data-target="#helpModal"><a data-toggle="modal"><span class="glyphicon glyphicon-cog"></span> Help</a></button></li> */}
                            {/* </ul> */}
                        {/* </div> */}
                    {/* </div> */}
                {/* </nav> */}
            {/* </div>  */}
      
            <div class="calibrationDiv">
                <div class="wrapper">
                    <input ref={this.targetRef} type="button" onClick={this.showGIF} class="btn btn-primary" id="calibrate" value="Click if your face is captured correctly."></input>
                    {/* <Overlay
                      show={this.state.show}
                      target={this.targetRef.current}
                      placement="auto"
                      
                    >
                      <Popover id="popover-contained">
                        <Popover.Title as="h3">Step 3: Next a blur view will appear on your screen. You need to move your mouse to get clear view and look at the cursor while moving.</Popover.Title>
                        <Popover.Content>
                        <img src="cal.gif" style={{width: "600px", height:"200px"}}></img>
                        </Popover.Content>
                      </Popover>
                    </Overlay> */}
                </div>
                
                <div id="Pt5" style={{display:"none"}}></div>
            </div>
            <div id="helpModal" class="modal fade" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <img src="calibration.png" id='image' width="100%" height="100%" alt="webgazer demo instructions"></img>
                        </div>
                        <div class="modal-footer">
                            <button id="closeBtn" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="Restart()">Calibrate</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <button type="button" class="btn btn-primary" onclick={this.handleButtonClick}>Calibrate</button> */}
        </div>
      );
    }
}

export default Calibration;