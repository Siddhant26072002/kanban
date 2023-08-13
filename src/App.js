import React, { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome from 'react-fontawesome';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "./styles.css";
import "./styles/tailwind-pre-build.css";

const PRIORITY_MAP = {
  "0": "No priority",
  "1": "Low",
  "2": "Medium",
  "3": "High",
  "4": "Urgent"
};

export default function App() {
  const [show,setShow]=useState(false);
  const [groupData, setGroupData] = useState({});
  const [users, setUsers] = useState({});
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [totalColumns, setTotalColumns] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchDetails() {
    setLoading(true);
    const { data } = await axios.get("https://apimocha.com/quicksell/data");
    console.log(data);
    const totalUsers = {};

    data.users?.map((user) => {
      totalUsers[user.id] = user;
    });

    setTickets(data.tickets);
    setUsers(totalUsers);
    getGroupData(groupBy, data.tickets);
  }

  function getGroupData(groupBy, tickets) {
    if (!tickets.length || !groupBy.length) {
      return;
    }

    let tempGroupData = {};

    tickets.map((ticket) => {
      if (tempGroupData[ticket[groupBy]]) {
        tempGroupData[ticket[groupBy]].push(ticket);
      } else {
        tempGroupData[ticket[groupBy]] = [ticket];
      }
    });

    setTotalColumns(Object.keys(tempGroupData).length);
    sortGroupData(sortBy, tempGroupData);
  }

  function sortGroupData(sortBy, groupData) {
    let tempGroupData = { ...groupData };
    let groupDataValuesArray = Object.values(tempGroupData);

    console.log("groupDataValuesArray: ", groupDataValuesArray);

    if (!groupDataValuesArray.length || !sortBy.length) {
      return;
    }

    groupDataValuesArray = groupDataValuesArray.map((groupDataArray) => {
      // sort in ascending order
      groupDataArray.sort((val1, val2) => {
        if (val1[sortBy] < val2[sortBy]) {
          return -1;
        }

        return 1;
      });

      if (sortBy === "priority") {
        // sort in descending order
        groupDataArray.reverse();
      }

      return groupDataArray;
    });

    let index = 0;
    for (let key in tempGroupData) {
      tempGroupData[key] = groupDataValuesArray[index++];
    }

    setGroupData(tempGroupData);
    setLoading(false);
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  console.log("groupBy: ", groupBy);
  return (
    <div className="">
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



      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="w-full flex justify-between heading ">
            {Object.keys(groupData).map((data, index) => {
              return (
                <div
                  className={`flex w-1/${totalColumns} mx-8 ind-heading`}
                  key={data + index}
                >
                  <div className="ind-heading-start">
                  {groupBy == "status" && data}
                  {groupBy == "userId" && users[data]?.name}
                  {groupBy == "priority" && PRIORITY_MAP[data]}

                  <span className="ml-2">{groupData[data].length}</span>
                    </div>
                    <div className="ind-heading-last">
                 <span> {groupBy == "status" && <FontAwesome name="plus" style={{ color: 'black', fontWeight: 'light' ,fontSize:'12px',opacity: 0.5  }}/> }</span>
                 <span>{groupBy == "status" && <FontAwesome name="ellipsis-h" style={{ fontSize: '12px',opacity: 0.5 }} /> }</span> 
                </div></div>
              );
            })}
          </div>
          <div className="w-full flex justify-between content">
            {Object.values(groupData).map((data, index) => (
              <div
                key={index}
                className={`flex flex-col w-1/${totalColumns} mx-8 my-4 ind-column`}
              >
                {data?.map((taskDetails) => (
                  <div className=" card" key={taskDetails.id}>
                    <div className="id">{taskDetails.id}</div>
                    <div className="title">{taskDetails.title}</div>
                    <div className="tag"><span className="outer-box"><FontAwesome name="exclamation" className="exclamation" style={{ fontSize: '12px',opacity: 0.5 }} />
                    </span>
                    <div className="tag-area"> <span><FontAwesome name="circle"className="circle" ></FontAwesome> </span>
                    <span>{taskDetails.tag}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
