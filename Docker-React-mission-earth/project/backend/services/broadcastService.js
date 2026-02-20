const { broadcastMessage } = require("./websocketManager");
const { executeSQLQuery, executeSQLQueryMedication, executeSQLQueryEvent, broadcastController } = require("../controllers/broadcastController");

// Variable to indicate whether broadcasting is in progress
global.isExecuting = false;

async function executeAndStoreQueryResult() {
  try {
    global.resetInterval();

    // Check if another execution is in progress
    if (global.isExecuting) {
      console.log("Another Broadcast is in progress. Skipping this execution.");
      return;
    }

    // Set isExecuting to true to indicate that execution is in progress
    global.isExecuting = true;

    const [ broadcastdata ] = await Promise.all([
      broadcastController()
    ]);

    // Store the query result data
    queryResultData = JSON.stringify(broadcastdata);

    broadcastMessage(queryResultData);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    // Handle the error gracefully, e.g., log it or send an error message to clients.
  } finally {
    // Reset isExecuting to false to allow the next execution
    global.isExecuting = false;
    global.resetInterval();
  }
}

module.exports = { executeAndStoreQueryResult };