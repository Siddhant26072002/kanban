import React, { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome from 'react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./Components/Navbar";
import Content from "./Components/Content_display";

import "./styles.css";
import "./styles/tailwind-pre-build.css";
import { Nav } from "react-bootstrap";
import Content_display from "./Components/Content_display";



export default function App() {
  const [show,setShow]=useState(false);
  const [groupData, setGroupData] = useState({});
  const [users, setUsers] = useState({});
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || "status");
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') ||"priority");
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

  useEffect(()=>{
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy',sortBy);
  },[groupBy,sortBy]);

  console.log("groupBy: ", groupBy);
  return (
    <div className="">

        <Navbar  getGroupData={getGroupData}
        setGroupBy={setGroupBy}
        show={show}
        setShow={setShow}
        groupBy={groupBy}
        tickets={tickets}
        setSortBy={setSortBy}
        groupData={groupData}
        sortGroupData={sortGroupData}
        />


      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Content_display 
        groupBy={groupBy}
        groupData={groupData}
        totalColumns={totalColumns}
        users={users}
        />
        </>
      )}
    </div>
  );
}
