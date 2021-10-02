function getData() // you can add a trigger to run this every day, week, hour, or at any other interval you wish
{
  const ids = [] // put all the ids for the projects you'd like to log for here

  var total = 0;
  var fetchTime = new Date().toISOString().split("T")[0]

  for(const id of ids)
  {
    var url = "https://addons-ecs.forgesvc.net/api/v2/addon/" + id // this api can provide slightly old results
    
    Logger.log(url)

    var websiteContent = UrlFetchApp.fetch(url).getContentText();
    
    var json = JSON.parse(websiteContent)

    total += json.downloadCount;

    var rows = 
    {
      date_time:fetchTime,
      downloads:json.downloadCount,
      projectId:id,
      title:json.name,
    };
    
    insertRowInTracker(rows)
  }

  // anything pass here inside of this method can be removed if you don't want it to log the sum of all their downloads as well 
  var rows = 
  {
    date_time:fetchTime,
    downloads:total,
    projectId:0,
    title:"Total Downloads"
  }

  insertRowInTracker(rows)
}

function insertRowInTracker(rowData) 
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rowValues = [];
  var columnHeaders = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  
  columnHeaders.forEach((header) => 
  {
    rowValues.push(rowData[header]);
  });
  sheet.appendRow(rowValues);
}
