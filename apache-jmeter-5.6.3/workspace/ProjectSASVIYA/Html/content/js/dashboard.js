/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "check header csv CPM"], "isController": false}, {"data": [0.0, 500, 1500, "AddMemo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Data From CSV  TestDataCPM"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateGenuine"], "isController": false}, {"data": [0.5, 500, 1500, "GetAlert"], "isController": false}, {"data": [0.5, 500, 1500, "ConfirmFraud"], "isController": false}, {"data": [1.0, 500, 1500, "CheckState"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateStatusReassign"], "isController": false}, {"data": [0.0, 500, 1500, "GetMemo"], "isController": false}, {"data": [0.5, 500, 1500, "SearchTransHistory"], "isController": false}, {"data": [1.0, 500, 1500, "Get Data From CSV  TestData"], "isController": false}, {"data": [0.5, 500, 1500, "Login Controller"], "isController": true}, {"data": [0.5, 500, 1500, "CallProcessManager"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [1.0, 500, 1500, "check header csv data "], "isController": false}, {"data": [0.5, 500, 1500, "GetReviewAndActionByRuleCode"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateGenuineSC"], "isController": false}, {"data": [1.0, 500, 1500, "GetAllFieldName"], "isController": false}, {"data": [0.5, 500, 1500, "GetReviewAndAction"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18, 0, 0.0, 978.1666666666666, 7, 2572, 704.5, 2478.4, 2572.0, 2572.0, 0.34156893999772286, 2.1558574329196554, 55.67618197085278], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["check header csv CPM", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 0.0, 0.0], "isController": false}, {"data": ["AddMemo", 1, 0, 0.0, 1841.0, 1841, 1841, 1841.0, 1841.0, 1841.0, 1841.0, 0.5431830526887561, 0.258330221347094, 310.25406538566], "isController": false}, {"data": ["Get Data From CSV  TestDataCPM", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 0.0, 0.0], "isController": false}, {"data": ["UpdateGenuine", 1, 0, 0.0, 2151.0, 2151, 2151, 2151.0, 2151.0, 2151.0, 2151.0, 0.46490004649000466, 0.22109992445374246, 265.5714275337053], "isController": false}, {"data": ["GetAlert", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 3.427400631500743, 0.956247678306092], "isController": false}, {"data": ["ConfirmFraud", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.8241316466552316, 981.8205269082333], "isController": false}, {"data": ["CheckState", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 3.243062033582089, 1.6907649253731343], "isController": false}, {"data": ["Login", 1, 0, 0.0, 1408.0, 1408, 1408, 1408.0, 1408.0, 1408.0, 1408.0, 0.7102272727272727, 0.7275668057528409, 0.24136629971590912], "isController": false}, {"data": ["UpdateStatusReassign", 1, 0, 0.0, 2468.0, 2468, 2468, 2468.0, 2468.0, 2468.0, 2468.0, 0.4051863857374392, 0.19270094712317667, 231.42394524918964], "isController": false}, {"data": ["GetMemo", 1, 0, 0.0, 1767.0, 1767, 1767, 1767.0, 1767.0, 1767.0, 1767.0, 0.5659309564233164, 18.343568725240523, 0.36476018675721567], "isController": false}, {"data": ["SearchTransHistory", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.5332904155027933, 1.051577775837989], "isController": false}, {"data": ["Get Data From CSV  TestData", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 0.0, 0.0], "isController": false}, {"data": ["Login Controller", 1, 0, 0.0, 1408.0, 1408, 1408, 1408.0, 1408.0, 1408.0, 1408.0, 0.7102272727272727, 0.7275668057528409, 0.24136629971590912], "isController": true}, {"data": ["CallProcessManager", 1, 0, 0.0, 1075.0, 1075, 1075, 1075.0, 1075.0, 1075.0, 1075.0, 0.930232558139535, 0.36155523255813954, 66.82867005813954], "isController": false}, {"data": ["Transaction Controller", 1, 0, 0.0, 16099.0, 16099, 16099, 16099.0, 16099.0, 16099.0, 16099.0, 0.06211565935772408, 6.993289082396422, 182.2276907727188], "isController": true}, {"data": ["check header csv data ", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 0.0, 0.0], "isController": false}, {"data": ["GetReviewAndActionByRuleCode", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 44.81838060461956, 0.944718070652174], "isController": false}, {"data": ["UpdateGenuineSC", 1, 0, 0.0, 2572.0, 2572, 2572, 2572.0, 2572.0, 2572.0, 2572.0, 0.38880248833592534, 0.18490899591757387, 222.070768127916], "isController": false}, {"data": ["GetAllFieldName", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 32.444090639810426, 1.4787285248815167], "isController": false}, {"data": ["GetReviewAndAction", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 38.57210497835498, 0.9511972402597403], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
