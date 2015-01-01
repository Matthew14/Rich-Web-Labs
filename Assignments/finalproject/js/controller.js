// C11354316 ( 1 + 2a, 3b, 4b, 5b+ 6)

var assignment = angular.module('assignment', []);


//Endpoint URLS:
var lucaBaseUrl = 'http://lucalongo.eu/courses/2014-2015/questionnaireDIT/app/index.php';
var tasksUrl = lucaBaseUrl + '/tasks';
var questionnairesUrl = lucaBaseUrl +'/questionnaires';
var nationalitiesUrl = lucaBaseUrl + '/nationalities';
var sNatUrl = lucaBaseUrl + '/students/nationality';
var studentsUrl = lucaBaseUrl + '/students';
var sQUrl = lucaBaseUrl + '/questionnaires/student';
var qTaskUrl = lucaBaseUrl + '/questionnaires/task';

assignment.controller('func1Controller', [ '$scope', '$http', function ($scope, $http) {
    var getAvg = function(data, col){
        var total = 0;
        data.forEach(function(d){ total += parseInt(d[col]);} );
        return total / data.length;
    };

    var getStdDev = function(data, col){
        var standardDeviation = 0, difference=0;
        var averageForCol = getAvg(data, col);
        data.forEach(function(d){
            difference = d[col] - averageForCol;
            standardDeviation += difference * difference;
        })
        return Math.sqrt(standardDeviation/(data.length - 1))
    };

    $scope.questionnaires = [];
    $http.get(questionnairesUrl).success(function(result){
            result.forEach(function(r){
                $http.get(questionnairesUrl + '/' + r.id).success(function(qDetail){
                    r['rmse'] = qDetail.details.rmse_value;
                    r['mwl']  = qDetail.details.mwl_value;
                    r['task'] = qDetail.details.task_number;
                    r['intrusiveness'] = qDetail.details.intrusiveness;
                    r['type'] = qDetail.questionnaireType;
                    r['value'] = qDetail.questionnaireValue;

                    var t1 = r.time_1.split(':');
                    var t2 = r.time_2.split(':');
                    t1 = t1[0] * 3600 + t1[1] * 60 + t1[2] * 1;
                    t2 = t2[0] * 3600 + t2[1] * 60 + t2[2] * 1;
                    r['time'] = Math.round((t2 - t1) / 60);

                    $scope.questionnaires.push(r);

            $scope.averages = {
                'rmse' : getAvg($scope.questionnaires, 'rmse'),
                'mwl' : getAvg($scope.questionnaires, 'mwl'),
                'intrusiveness' : getAvg($scope.questionnaires, 'intrusiveness'),
                'time' : getAvg($scope.questionnaires, 'time'),
                'value' : getAvg($scope.questionnaires, 'value'),
            };

            $scope.stdDev = {
                'rmse' : getStdDev($scope.questionnaires, 'rmse'),
                'mwl' : getStdDev($scope.questionnaires, 'mwl'),
                'intrusiveness' : getStdDev($scope.questionnaires, 'intrusiveness'),
                'time' : getStdDev($scope.questionnaires, 'time'),
                'value' : getStdDev($scope.questionnaires, 'value'),
            };
       });
    });

});

}]);

assignment.controller('func2aController',[ '$scope', '$http', '$q', function ($scope, $http, $q) {
    var countryNames = [];
    var nationalities = [];
    $scope.wait = 'please wait, this takes a while, message will disappear when done';

    $http.get(nationalitiesUrl).success(function(data) {
        var reqData = [];
        data.forEach(function(nationality) {
            countryNames.push(nationality.description);
            reqData.push($http.get(sNatUrl + '/' + nationality.id));
        });

        $q.all(reqData).then(function success (results) {
            results.forEach(function(studentsOfNationality, nameIndex) {
                if (studentsOfNationality.data.length > 0)
                    nationalities.push({ label: countryNames[nameIndex], value: studentsOfNationality.data.length});
            });

        $scope.wait = '';

        $scope.pie = new d3pie("pie", {
            size: {canvasHeight: 500, canvasWidth: 500},
            labels: {
                "outer": { "pieDistance": 32 },
                "inner": { "hideWhenLessThanPercentage": 3 },
                "mainLabel": { "fontSize": 11 },
                "percentage": {
                    "color": "#ffffff",
                    "decimalPlaces": 0
                },
                "value": {
                    "color": "#adadad",
                    "fontSize": 11
                },
                "lines": {"enabled": true}
            },
            data: {content: nationalities}
        });
    });
        });
}]);

assignment.controller('func3bController',[ '$scope', '$http', '$q', function ($scope, $http, $q) {
    var data = [];
    $scope.wait = 'please wait, this takes a while, message will disappear when done';
    $http.get(studentsUrl).success(function(data) {
        var reqData = [];
        data.forEach(function(student) {
            reqData.push($http.get(sQUrl + '/' + student.id));
        });

        $q.all(reqData).then(function success (results) {
            results.forEach(function(questionnaire, index) {
                if (questionnaire.data.length > 0)
                    data.push({ student: questionnaire.data[0].student_number, frequency: questionnaire.data.length});
            });

            $scope.wait = '';
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 1);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select("#func3b").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              data.forEach(function(d) {d.frequency = +d.frequency;});

            x.domain(data.map(function(d) { return d.student; }));
            y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size","7px")
            .attr("dx", "-.8em")
            .attr("dy", "-1em")
            .attr("transform", "rotate(-90)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.student); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); });

            d3.select("input").on("change", change);

            var sortTimeout = setTimeout(function() {
            d3.select("input").property("checked", true).each(change);
            }, 2000);

            function change() {
                clearTimeout(sortTimeout);

                // Copy-on-write since tweens are evaluated after a delay.
                var x0 = x.domain(data.sort(this.checked
                    ? function(a, b) { return b.frequency - a.frequency; }
                    : function(a, b) { return d3.ascending(a.student, b.student); })
                    .map(function(d) { return d.student; }))
                    .copy();

                var transition = svg.transition().duration(750),
                    delay = function(d, i) { return i * 50; };

                transition.selectAll(".bar")
                    .delay(delay)
                    .attr("x", function(d) { return x0(d.student); });

                transition.select(".x.axis")
                    .call(xAxis)
                  .selectAll("g")
                    .delay(delay);
            }
        });
    });
}]);

assignment.controller('func4bController',['$scope', '$http', '$q', function ($scope, $http, $q) {

}]);


assignment.controller('func5bController',['$scope', '$http', '$q', function ($scope, $http, $q) {
    var data = [];
    var students = [];
    $scope.wait = 'please wait, this takes a while, message will disappear when done';
    $http.get(studentsUrl)
            .success(function(students) {

           students.forEach(function(s) {
                var age = s.age;
                if(age <= 4) students[s.id] = 0
                else if (age <= 13) students[s.id] = 1
                else if (age <= 17) students[s.id] = 2
                else if (age <= 24) students[s.id] = 3
                else if (age <= 44) students[s.id] = 4
                else if (age <= 64) students[s.id] = 5
                else students[s.id] = 6;
            });

            $http.get(tasksUrl).success(function(tasksData) {

                var reqData = [];
                tasksData.forEach(function(task) {
                    reqData.push($http.get(qTaskUrl + '/' + task.task_id));
                });

                $q.all(reqData).then(function success (results) {
                    results.forEach(function(questionnaire, index) {
                        var questionnaires = questionnaire.data;
                        if(questionnaires.length > 0) {
                            var groupy = [];
                            for (var i=0; i < 7; ++i)
                                groupy[i] = 0;

                            questionnaires.forEach(function(questionaire) {
                                groupy[students[questionaire.student_number]]++;
                            });
                            var obj = {
                                "task": questionnaires[0].task_number,
                                "< 5": groupy[0],
                                "5 - 13": groupy[1],
                                "14 - 17": groupy[2],
                                "18 - 24": groupy[3],
                                "25 - 44": groupy[4],
                                "45 - 64": groupy[5],
                                ">=65": groupy[6]
                            };

                            data.push(obj);
                        }
                    });
                    $scope.wait = '';
                    var radius = 74,
                    padding = 10;

                    var color = d3.scale.ordinal()
                        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                    var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius - 30);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) { return d.population; });

                    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "task"; }));

                    data.forEach(function(d) {
                        d.ages = color.domain().map(function(name) {return {name: name, population: +d[name]}; });
                    });

                    var legend = d3.select("#func5b").append("svg")
                            .attr("class", "legend")
                            .attr("width", radius * 2)
                            .attr("height", radius * 2)
                        .selectAll("g")
                            .data(color.domain().slice().reverse())
                        .enter().append("g")
                            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                    legend.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    legend.append("text")
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .text(function(d) { return d; });

                    var svg = d3.select("#func5b").selectAll(".pie")
                        .data(data)
                        .enter().append("svg")
                        .attr("class", "pie")
                        .attr("width", radius * 2)
                        .attr("height", radius * 2)
                        .append("g")
                        .attr("transform", "translate(" + radius + "," + radius + ")");

                    svg.selectAll(".arc")
                        .data(function(d) { return pie(d.ages); })
                    .enter().append("path")
                        .attr("class", "arc")
                        .attr("d", arc)
                        .style("fill", function(d) { return color(d.data.name); });

                    svg.append("text")
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) { return d.task; });
                                });
                            });
    });
}]);


assignment.controller('func6Controller',['$scope', '$http', '$q', function ($scope, $http, $q) {
    tasks = {};
    var allTheTypes = [];
    $scope.wait = 'please wait, this takes a while, message will disappear when done';
    $http.get(questionnairesUrl).success(function(task) {
        var reqData = [];
        task.forEach(function(t) {
            reqData.push($http.get(questionnairesUrl + '/' + t.id));
        });

        $q.all(reqData).then(function success (results) {
            results.forEach(function(questionnaire) {
                var ti = questionnaire.data.details.task_number;
                if(tasks[ti] === undefined) {tasks[ti] = { id: ti, nasa: 0, at: 0, wp: 0}}
                if (questionnaire.data.questionnaireType=="NASA") {tasks[ti].nasa++;};
                if (questionnaire.data.questionnaireType=="AT") {tasks[ti].at++;};
                if (questionnaire.data.questionnaireType=="WP") {tasks[ti].wp++;};
            });

            angular.forEach(tasks, function(task) {
                allTheTypes.push({ task: task.id, frequency: {NASA: task. nasa, AT: task.at, WP: task.wp}});
            });

            $scope.wait = '';

            var id = '#func6';
            var barColor = 'steelblue';
            function segColor(c){ return {NASA:"#807dba", AT:"#e08214",WP:"#41ab5d"}[c]; }

            // compute total for each state.
            allTheTypes.forEach(function(d){d.total=d.frequency.NASA+d.frequency.AT+d.frequency.WP;});

            // function to handle histogram.
            function histoGram(fD){
                var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
                hGDim.w = 500 - hGDim.l - hGDim.r,
                hGDim.h = 300 - hGDim.t - hGDim.b;

                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                    .attr("width", hGDim.w + hGDim.l + hGDim.r)
                    .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                    .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                        .domain(fD.map(function(d) { return d[0]; }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
                    .attr("transform", "translate(0," + hGDim.h + ")")
                    .call(d3.svg.axis().scale(x).orient("bottom"));

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                        .domain([0, d3.max(fD, function(d) { return d[1]; })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                        .append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect")
                    .attr("x", function(d) { return x(d[0]); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return hGDim.h - y(d[1]); })
                    .attr('fill',barColor)
                    .on("mouseover",mouseover)// mouseover is defined below.
                    .on("mouseout",mouseout);// mouseout is defined below.

                //Create the frequency labels above the rectangles.
                bars.append("text").text(function(d){ return d3.format(",")(d[1])})
                    .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
                    .attr("y", function(d) { return y(d[1])-5; })
                    .attr("text-anchor", "middle");

                function mouseover(d){  // utility function to be called on mouseover.
                    // filter for selected state.
                    var st = allTheTypes.filter(function(s){ return s.task == d[0];})[0],
                        nD = d3.keys(st.frequency).map(function(s){ return {type:s, frequency:st.frequency[s]};});

                    // call update functions of pie-chart and legend.
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout(d){    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.
                    pC.update(tF);
                    leg.update(tF);
                }

                // create function to update the bars. This will be used by pie-chart.
                hG.update = function(nD, color){
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function(d) {return y(d[1]); })
                        .attr("height", function(d) { return hGDim.h - y(d[1]); })
                        .attr("fill", color);

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function(d){ return d3.format(",")(d[1])})
                        .attr("y", function(d) {return y(d[1])-5; });
                }
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD){
                var pC ={},    pieDim ={w:250, h: 250};
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                    .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                    .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function(d) { return d.frequency; });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                    .each(function(d) { this._current = d; })
                    .style("fill", function(d) { return segColor(d.data.type); })
                    .on("mouseover",mouseover).on("mouseout",mouseout);

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function(nD){
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                        .attrTween("d", arcTween);
                }
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d){
                    // call the update function of histogram with new data.
                    hG.update(allTheTypes.map(function(v){
                        return [v.task,v.frequency[d.data.type]];}),segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout(d){
                    // call the update function of histogram with all data.
                    hG.update(allTheTypes.map(function(v){
                        return [v.task,v.total];}), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) { return arc(i(t));    };
                }
                return pC;
            }

            // function to handle legend.
            function legend(lD){
                var leg = {};

                // create table for legend.
                var legend = d3.select(id).append("table").attr('class','legend');

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                    .attr("width", '16').attr("height", '16')
                    .attr("fill",function(d){ return segColor(d.type); });

                // create the second column for each segment.
                tr.append("td").text(function(d){ return d.type;});

                // create the third column for each segment.
                tr.append("td").attr("class",'legendFreq')
                    .text(function(d){ return d3.format(",")(d.frequency);});

                // create the fourth column for each segment.
                tr.append("td").attr("class",'legendPerc')
                    .text(function(d){ return getLegend(d,lD);});

                // Utility function to be used to update the legend.
                leg.update = function(nD){
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the frequencies.
                    l.select(".legendFreq").text(function(d){ return d3.format(",")(d.frequency);});

                    // update the percentage column.
                    l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
                }

                function getLegend(d,aD){ // Utility function to compute percentage.
                    return d3.format("%")(d.frequency/d3.sum(aD.map(function(v){ return v.frequency; })));
                }

                return leg;
            }

            // calculate total frequency by segment for all task.
            var tF = ['NASA','AT','WP'].map(function(d){
                return {type:d, frequency: d3.sum(allTheTypes.map(function(t){ return t.frequency[d];}))};
            });

            // calculate total frequency by task for all segment.
            var sF = allTheTypes.map(function(d){return [d.task,d.total];});

            var hG = histoGram(sF), // create the histogram.
                pC = pieChart(tF), // create the pie-chart.
                leg= legend(tF);  // create the legend.



        });
    });
}]);
