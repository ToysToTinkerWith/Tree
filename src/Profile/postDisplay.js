import React, { useEffect, useState } from "react"

import { db } from "../firebase"

import { Typography, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  description: {
    margin: theme.spacing(1),
  },
  comment: {
    margin: theme.spacing(1),
    backgroundColor: "#4fc3f7"
  },
}))

function PostDisplay(props) {

    const [comments, setComments] = useState([])

    const classes = useStyles()

    let date = ""
    let time = ""
    
    if (props.post.timestamp) {
      date = props.post.timestamp.toDate().toLocaleDateString()
      time = props.post.timestamp.toDate().toLocaleTimeString()
    } 

    useEffect(() => {

    db.collection("comments").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      let incomingComments = []

      snapshot.docs.forEach(doc => {
        if(doc.data().postId === props.post.psudeoId) {
          incomingComments.push(doc.data())
        }
      })

      setComments(incomingComments)

    })

   }, )

    return (
      <div>
        <div className={classes.description}>
          <hr/>
          <img src={props.post.imageUrl} alt="" height="400" width="400" /> 
          <Typography variant="h4" color="secondary" > {props.post.description} </Typography>
          <Typography variant="h5" color="secondary"> Posted By: {props.post.postedBy} </Typography>
          <Typography align="right" variant="h5" color="secondary"> {date + " @ " + time} </Typography>
          
        </div>
        <div className={classes.comment}>
          {comments.length > 0 ? comments.map(comment => {

            let commentDate = ""
            let commentTime = ""
            
            if (comment.timestamp) {
              commentDate = comment.timestamp.toDate().toLocaleDateString()
              commentTime = comment.timestamp.toDate().toLocaleTimeString()
            } 

            return [comment.imageUrl ? 
              [<hr/>,
              <img key={Math.random().toString(36)} src={comment.imageUrl} alt="" height="200" width="200" />] :
              <hr/>,
            <Typography variant="h6" color="secondary"> {comment.postedBy} : {comment.comment} </Typography>,
            <Typography align="right" variant="h6" color="secondary"> {commentDate + " @ " + commentTime} </Typography>,
            <hr/>]
          }) :
          null }
        </div>
        <hr/>
      </div>
    )
  }


export default PostDisplay