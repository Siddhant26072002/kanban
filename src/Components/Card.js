import React from 'react'
import FontAwesome from 'react-fontawesome'

export default function Card({taskDetails}) {
  return (
    <div className="card" key={taskDetails.id}>
                    <div className="id">{taskDetails.id}</div>
                    <div className="title">{taskDetails.title}</div>
                    <div className="tag"><span className="outer-box"><FontAwesome name="exclamation" className="exclamation" style={{ fontSize: '12px',opacity: 0.5 }} />
                    </span>
                    <div className="tag-area"> <span><FontAwesome name="circle"className="circle" ></FontAwesome> </span>
                    <span>{taskDetails.tag}</span></div>
                    </div>
                  </div>
  )
}
