import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkList } from "../data/DefaultData"; 

function NavList({width}) {
  const navigate = useNavigate();

  return (
    <div className="NavList" style={{width:width}}>
      {LinkList?.map((ListItem)=> 
      (
        <div
          key={ListItem.id}
          className='NavButton'
          onClick={() => (window.location.href = ListItem.location)}
        >
          <span>{ListItem.name}</span> 
          <span>{ListItem.icon}</span>
        </div>
      ))}
    </div>
  )
}
        // <div key={ListItem.id} className='NavButton' onClick={()=>(navigate(ListItem.location))}>
        //   <span>{ListItem.name}</span> 
        //   <span>{ListItem.icon}</span>
        // </div>

export default NavList
