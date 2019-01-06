import React, { Component } from "react";
import FaceBox from '../FaceBox/FaceBox.js';
import "./FaceRecognition.css";

class ImageLinkForm extends Component {

    render() {
        const {imageUrl, boxArray} = this.props;
        return (
            <div className="center ma">
                <div className="absolute mt2">
                    <img id="inputimage" alt="photowithface" src={imageUrl} width="500px" height="auto" />
                    {
                        boxArray.length > 0?
                        boxArray.map((box, i) => {
                                return(
                                    <FaceBox key={i} box={box} />
                                    )
                            })
                        :<div/>
                    }
                </div>
            </div>
        );
    }
}

export default ImageLinkForm;
