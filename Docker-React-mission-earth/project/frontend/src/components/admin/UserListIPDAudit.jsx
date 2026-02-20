import React from "react";

function UserListIPDAudit({ data }) {
  return (
    <div className="IPDAuditTable">
      <div className="IPDAuditTable_Header">USERS</div>
      <div className="IPDAuditTable_Table_Body">
        <table className="IPDAuditTable_Table">
          <thead>
            <tr className="IPDAuditTable_HeaderRow">
              <th>#</th>
              <th>USERNAME</th>
              <th>NAME</th>
              <th>ADMIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
              <td>1</td>
              <td>s</td>
              <td>s</td>
              <td>s</td>
              <td>s</td>
            </tr> */}
            {data && data.length>0 ? data?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.Type}</td>
                  <td>
                    {/* <AuditAction id={item.id}/> */}
                    1 2 3
                  </td>
                </tr>
              ))
              :
              <tr>
                <td colSpan={5}>No Data</td>
              </tr>
              }
          </tbody>
        </table>
      </div>
    </div>
  );
}

//export default UserListIPDAudit;
