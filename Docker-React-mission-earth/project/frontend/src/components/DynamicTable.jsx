import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DialogEdit from "./admin/DialogEdit";
import DialogNew from "./admin/DialogNew";

function arrayToCommaText(value) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

const roleMap = {
  1: "เภสัช",
  2: "พยาบาล",
  // 3: "เจ้าหน้าที่ประสานสิทธิ",
};

function DynamicTable({
  title,
  data,
  NewFunction,
  EditFunction,
  EditContent,
  EditContentMode,
  setRefresh,
  RemoveFunction,
}) {
  const ARRAY_KEY = data ? Object.keys(data[0]) : null;

  return (
  <>

    <div className="IPDAuditTable">
      {title && <div
        className={
          NewFunction
            ? "IPDAuditTable_Header Header_Between"
            : "IPDAuditTable_Header"
        }
      >
        <span>{title || "Untitled"}</span>
        {NewFunction && (
          <span>
            <DialogNew
              setRefresh={setRefresh}
              EditContentMode="new"
              Content={EditContent}
            />
          </span>
        )}
      </div>}
      <div className={title ? "IPDAuditTable_Table_Body" : "IPDAuditTable_Table_Body_Full"}>

        <table className="IPDAuditTable_Table">
          <thead>
            {Array.isArray(ARRAY_KEY) && ARRAY_KEY.length > 0 ? (
              <tr className="IPDAuditTable_HeaderRow">
                {ARRAY_KEY.map((item, index) => {
                  if (item === "DeletedAt") return null;
                  if (item === "TopicId") return null;
                  if (item === "SubTopicId") return null;
                  if (item === "DeptId") return null;
                  if (item === "PctId") return null;
                  if (item === "Id") return <th key={index}>#</th>;
                  return (
                    <th
                      key={`Header-${index}`}
                      className={
                        item === "Question" ||
                        item === "Topic" ||
                        item === "SubTopic"
                          ? "IPDAuditTable_TableData_Left"
                          : "IPDAuditTable_TableData"
                      }
                    >
                      {item}
                    </th>
                  );
                })}
                <th>Action</th>
              </tr>
            ) : (
              <tr className="IPDAuditTable_HeaderRow">
                <th>No Data</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data && ARRAY_KEY && data.length > 0 ? (
              data?.map((item, index) => (
                <tr key={`CellData-${index}`}>
                  {ARRAY_KEY.map((ArrayItem, Arrayindex) => {
                    if (ArrayItem === "DeletedAt") return null;
                    if (ArrayItem === "TopicId") return null;
                    if (ArrayItem === "SubTopicId") return null;
                    if (ArrayItem === "DeptId") return null;
                    if (ArrayItem === "PctId") return null;

                    const rawValue = item[ArrayItem];
                    const roleName = roleMap[rawValue] || "-";
                    const value =
                      ArrayItem === "Dept" || ArrayItem === "Pct"
                        ? arrayToCommaText(rawValue)
                        : rawValue ?? "";                   

                    return (
                      <td
                        key={`SplitData-${Arrayindex}`}
                        className={
                          ArrayItem === "Question" ||
                          ArrayItem === "Topic" ||
                          item === "SubTopic"
                            ? "IPDAuditTable_TableData_Left"
                            : "IPDAuditTable_TableData"
                        }
                      >
                        {
                          ArrayItem === "Role" ? (
                            rawValue === 3 ? "Admin" : "User"
                          ) : ArrayItem === "UserType" ? (
                            roleName
                            ) : ((ArrayItem === "SubQuestions" ? (
                            (() => {
                              if (!value || value.length === 0) return null;
                              try {
                                const parsed = JSON.parse(value);
                                return Array.isArray(parsed)
                                  ? parsed.map((item, index) => (
                                      <div key={`SubQindex_${index}`}>{item}</div>
                                    ))
                                  : <div></div>;
                              } catch (err) {
                                console.log("error",err)
                                return <div>Error parsing SubQuestions</div>;
                              }
                            })()
                          ) : (
                            value
                          )))
                        }

                      </td>
                    );
                  })}
                  <td>
                    {EditFunction && (
                      <DialogEdit
                        Id={item.Id}
                        setRefresh={setRefresh}
                        EditContentMode={EditContentMode}
                        Content={EditContent}
                        OriginalContent={item}
                      />
                    )}
                    {RemoveFunction && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => RemoveFunction(item.Id || item.UserId)}
                      >
                        {item.Status === "Active" ? (
                          <DeleteIcon />
                        ) : (
                          <AutorenewIcon />
                        )}
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="IPDAuditTable_HeaderRow">
                <td>No Data</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  </>
  );
}

export default DynamicTable;
