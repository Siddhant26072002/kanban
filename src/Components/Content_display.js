import React from 'react'
import FontAwesome from 'react-fontawesome';
import Card from './Card';

export default function Content_display({groupBy,groupData,totalColumns,users}) {
  const PRIORITY_MAP = {
  "0": "No priority",
  "1": "Low",
  "2": "Medium",
  "3": "High",
  "4": "Urgent"
};
  return (
    
    <div><div className="w-full flex justify-between heading ">
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
                  <Card taskDetails={taskDetails}/>
                ))}
              </div>
            ))}
          </div></div>
  )
}
