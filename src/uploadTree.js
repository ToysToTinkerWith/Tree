import React from "react"
import Map from "./map"

import firebase from "firebase"
import { db, storage } from "./firebase"

class TreeFourm extends React.Component {
  constructor() {
    super()
    this.state = {
      descrip: "",
      type: "",
      progress: 0,
      image: null,

      lat: 47.7511,
      lng: 120.7401,
      zoom: 10,
      located: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  
  }
  
  /*
  const [descrip, setDescrip] = useState("")
  const [type, setType] = useState("")
  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState(null)

  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [zoom, setZoom] = useState(10)
  const [located, setLocated] = useState(false)
  */




  /*useEffect(() => {
    if (!located) {
      if ("geolocation" in navigator) {
      console.log("Available")
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude)
        console.log("Longitude is :", position.coords.longitude)
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)

        if (lat !== "" && lng !== "") {
          
          setSrcStr("https://www.google.com/maps/embed/v1/view?key=AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA&center=" + lat + "," + lng + "&zoom=18")
          setLocated(true)
          console.log(srcStr)
        }
        

    })
    } else {
      console.log("Not Available")
    }
    }
    

  },)*/
componentDidMount() {
  // Get location of user
  const success = (position) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    console.log(latitude, longitude)
    this.setState({
      lat: latitude,
      lng: longitude,
      zoom: 15
    });
  };

  const error = () => {
    console.log("Unable to retrieve your location")
  };

  navigator.geolocation.getCurrentPosition(success, error)
}
    
  

    
  handleChange(event) {

    const {name, value} = event.target

    this.setState({[name]: value})
  }


  handleFileChange(e) {
    if(e.target.files[0]) {
      this.setState({
        image: e.target.files[0]
      })
    }
  }

  handleUpload() {
    const uploadTask = storage.ref("images/" + this.state.image.name).put(this.state.image)

    uploadTask.on("state_changed", (snapshot) => {
      const newProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      this.setState({
        progress: newProgress
      })
    },
    (error) => {
      alert(error.message)
    },
    () => {
      storage.ref("images").child(this.image.name).getDownloadURL().then(url => {
        db.collection("publicTrees").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          owner: "public",
          imageUrl: url,
          username: this.props.username,
          description: this.state.descrip,
          type: this.state.type
        })
      })

      this.setState({
        progress: 0,
        descrip: "",
        type: "",
        image: null
      })
   
    }
    )

  }

    render() {

      

      return (
      <div>
        <progress value={this.state.progress} max="100" />
        <br/>
        <input type="text" placeholder="Enter the tree classification.." name="type" onChange={this.handleChange} value={this.state.type} />
        <br/>
        <input type="text" placeholder="Enter a description" name="descrip" onChange={this.handleChange} value={this.state.descrip} />
        <br/>
        <input type="file" onChange={this.handleFileChange}/>
        <br/>
        <input type="text" placeholder="Latitude" name="lat" onChange={this.handleChange} value={this.state.lat} />
        <input type="text" placeholder="Longitude" name="lng" onChange={this.handleChange} value={this.state.lng} />
        <button onClick={this.handleUpload}> Upload </button>
        
        <Map lat={this.state.lat} lng={this.state.lng} zoom={this.state.zoom}/>

      </div>
    )
    }
    
  

    
}

export default TreeForum