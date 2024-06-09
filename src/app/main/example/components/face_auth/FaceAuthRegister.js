import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Link } from 'react-router-dom';
import SnackbarAlert from '../subComponent/SnackbarAlert';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import history from '@history';
import { Button, DialogActions,DialogTitle, DialogContent } from '@material-ui/core';
import XRayApi, { FACE_AUTH_URL } from '../../api/backend';
import { flattenErrorMessages, setAccessToken } from '../../api/utilities';
import axios from 'axios';


const FaceAuthRegister=props=>{

    const [errorMessages, setErrorMessages] = useState([]);



    var width = window.innerWidth-50;
    var height = window.innerHeight-500;
    width=Math.min(width,height)
    height=width 

   

    const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
        faceDetectionOptions: {
          model: 'short',
        },
        faceDetection: new FaceDetection.FaceDetection({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        }),
        camera: ({ mediaSrc, onFrame }) =>
          new Camera(mediaSrc, {
            onFrame,
            width,
            height,
          }),
      });


    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

        const registerClick=()=>{
            const imageSrc = webcamRef.current.getScreenshot();
			if(facesDetected===1){
                var formData = new FormData();
                var imagefile = dataURLtoFile(imageSrc,"image.jpeg")
                formData.append("image", imagefile);
                axios.post(`${FACE_AUTH_URL}/create/${props.match.params.phone}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res=>{
                    setErrorMessages([`Face registred successfully for user ${props.match.params.phone}`])
                    history.replace('/login');
                }).catch(err=>{
                    setErrorMessages(['Error occured'])
                })
				//XRayApi.userfaceAuth({imageSource}, apiResponse);
                
			}
			else if (facesDetected===0)
                setErrorMessages(['No face found'])
			else if(facesDetected>1)
                setErrorMessages(['Multiple face error'])
			else
                setErrorMessages(['Camera is not ready yet'])
        }

    return(
        <div>
            <div style={{position:'absolute',top:0,right:0}}>
                {
                    errorMessages &&
                    errorMessages.map(msg => <SnackbarAlert severity="info">{msg}</SnackbarAlert>)
                }
            </div>
            <div style={{
            width:'100vw',
            height:'100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>

            <div style={{
                width:`${width+50}px`,
                display:'block'
            }}>
                <div open={true}>
                    <DialogTitle>
                        Face Authentication <span
                            style={{
                                display:'inline-block',
                                height:'15px',
                                transform:'translateY(2px)',
                                fontSize:'0.6em',
                                color:facesDetected===1?'green':'red'
                              
                            }}>
                                {
                                    facesDetected===0?(
                                        'No face detected'
                                    ):(
                                        facesDetected===1?(
                                            'Face Detected'
                                        ):(
                                            'More than 1 face'
                                        )
                                    )
                                }
                            </span>
                    </DialogTitle>
                    <DialogContent>
                    <div style={{ width, height, position: 'relative',overflow:'hidden' }}>
                        {boundingBox.map((box, index) => (
                        <div
                            key={`${index + 1}`}
                            style={{
                            border: '4px solid red',
                            position: 'absolute',
                            top: `${box.yCenter * 100}%`,
                            left: `${box.xCenter * 100}%`,
                            width: `${box.width * 100}%`,
                            height: `${box.height * 100}%`,
                            zIndex: 1,
                            }}
                        />
                        ))}
                        <Webcam
                            ref={webcamRef}
                            forceScreenshotSourceSize
                            screenshotFormat="image/jpeg"
                            style={{
                                height,
                                width,
                                position: 'absolute',
                            }}
                        />
                    </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color='primary'
                            variant='outlined'
                           
                            onClick={()=>{
                                props.history.goBack()
                            }}
                            >
                            Cancel
                        </Button>
                        <Button
                            onClick={registerClick}
                            variant='contained'
                               color='primary'
                               >
                               Register
                           </Button>
                        
                    </DialogActions>
                </div>
            </div>
        </div>
            
        </div>
        
    )
}

export default FaceAuthRegister