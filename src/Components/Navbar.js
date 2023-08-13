import React from 'react'
import FontAwesome from 'react-fontawesome';

export default function Navbar({getGroupData,setGroupBy,show,setShow,groupBy,tickets,setSortBy,groupData,sortGroupData}) {
  return (
   <div className="navbar" >
          <div className="main-dropdown" onClick={() => setShow(!show)}>
            <span>Display</span>
            <FontAwesome name="angle-down"></FontAwesome>
          </div>
     {show && <div className="adjust"><div className="select">        
      <span>
        Grouping:
        </span>
        <select className="selection"
          value={groupBy}
          onChange={({ target }) => {
            getGroupData(target.value, tickets);
            setGroupBy(target.value);
          }}
        >
          <option value="status">Status</option>
          <option value="userId">User</option>
          <option value="priority">Priority</option>
        </select></div>

      <div className="select">
        <span> Ordering: </span>
        <select className="selection"
          defaultValue="priority"
          onChange={({ target }) => {
            sortGroupData(target.value, groupData);
            setSortBy(target.value);
          }}
        >
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select></div></div>}
    
    </div>
  )
}
