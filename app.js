(function loadScript() {
    'use strict';

    var windowWidth = window.outerWidth,
        windowHeight = window.outerHeight;

    // for reverse
    var startPositions = [],
        slide4reverse = false,
        slide5reverse = false,
        slide6reverse = false,
        slide7reverse = false,
        slide8reverse = false,
        slide11reverse = false;

    // store positions
    var slide9Grade1 = [],
        slide9Grade12 = [],
        slide9passed = [],
        slide9university = [];

    // config
    var width = 880,
        height = 480,
        padding = 20,
        gradeBuckets = 3000,
        colCount = 0,
        rowCount = 0,
        colLimit = 10,
        xPos = 10,
        yPos = height - 30,
        radius = 2.2,
        spacing = 1.6,
        startXpos = xPos,
        labelXpos = startXpos,
        labels,
        slideOffset = window.innerHeight / 3,
        transition = 500,
        percentLines = [],
        pLinesExist = false,
        gradeOneMarkers = [],
        gradeTwelveMarkers = [],
        gradeThirteenMarkers = [],
        gradeFourteenMarkers = [],
        slideNineRun = false,
        ignoreTrigger = true,
        debug = false,
        circlesAdded = false,
        circlesReady = false,
        mobile = false,
        scrollDebug = true,
        oneHundred,
        employed;

    var tooltip; 

    // mobile
    if (windowWidth < 651) {
        width = window.outerWidth - 50,
            height = window.outerHeight - 50,
            gradeBuckets = 7000,
            radius = 2,
            spacing = 1.3,
            colLimit = 7,
            mobile = true;

    }

 

    var percentages = [55, 100, 37, 13];

    var employment = {
        graduates: 87,
        matric: 66,
        noMatric: 55
    }

    const scroller = scrollama();

    d3.select("#chart")
        .style("width", width + padding * 2 + "px")
        .style("height", height + padding * 2 + "px");

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + padding * 2)
        .attr("height", height + padding * 2)
        .append("g")
        .attr("transform", "translate(" + padding + " , " + padding + ")"),
        pos = $("svg").position();


    // tooltip = d3.select(".tooltip");

    // add group for lines
    var pLines = svg.append("g")
        .attr("class", "p-lines");

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function addCircles(gradeCount, className) {
        var c;
        var bar = svg.append("g")
            .attr("class", className + "group");

        for (c = 0; c < gradeCount; c++) {

            bar.append("circle")
                .attr("cx", 50)
                .attr("cy", yPos)
                .attr("r", 3)
                .attr("class", className)
                .style("opacity", 0)

        }

    }

    function spreadCircles() {
        var xx = 200,
            yy = height / 4 * 3,
            colc = 0;

        // var testData = d3.range(0, 100);

        var dWidth = 50 * 6 + (49 * spacing);

        if (mobile) {
            var origX = xx = (width - dWidth) / 3;
        } else {
            var origX = xx = (width - dWidth) / 2;
        }

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this)
                    .attr("cx", xx)
                    .attr("cy", yy)
                    .transition()
                    .delay(function () {
                        return randomInt(50, 500);
                    })
                    .style("opacity", 1)

                colc > 50 ? (xx = origX, yy += 9, colc = 0) : (xx += 8.7, colc++);

            })

    }

    function spreadCirclesReverse() {

        var xx = 200,
            yy = height / 4 * 3,
            colc = 0;

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this).transition()
                    .delay(function () {
                        return randomInt(5, 500);
                    })
                    .duration(transition)
                    .attr("cx", xx).attr("cy", yy).attr("r", 3).style("fill", "#fffcbc").style("opacity", 1)

                colc > 50 ? (xx = 200, yy += 9, colc = 0) : (xx += 8.7, colc++);

            })

    }

    function makeBars(groupName, className, barNo, pupilCount, year, labelClass, start, label, ref) {

        !start ? (xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2), yPos = height - 30) : (xPos = 0, yPos = height - 30);

        if (startPositions[1] && groupName == "bar2") {
            xPos = startPositions[1];
        }

        startPositions.push(xPos);

        startXpos = xPos, colCount = 0;

        var bar = svg.select(className + "group");

        // barlabels
        bar.append("text")
            .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .attr("y", height - 5)
            .html(year)
            .attr("class", "barLabels")
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .style("opacity", function () {
                if (groupName === "bar13" || groupName === "bar14") {
                    return 0;
                } else {
                    return 1;
                }
            })

        // bar circles
        d3.selectAll(className)
            .each(function (d, i) {
                d3.select(this)
                    .transition()
                    .delay(function () {
                        return randomInt(5, 500);
                    })
                    .duration(transition * 3)
                    .attr("cx", xPos)
                    .attr("cy", yPos)
                    .attr("r", radius)
                    .style("fill", function () {
                        if (className === ".grade13") {
                            return "white";
                        } else if (className === ".grade14") {
                            return "lightgreen";
                        }
                        // else { return col; }
                    })
                    .style("opacity", function () {
                        if (groupName === "bar13" || groupName === "bar14") {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    .style("stroke", "none")

                xPos = xPos + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    colCount = 0;
                    xPos = startXpos;
                    yPos = yPos - spacing - radius * 2;
                }
            })

        //    barNumbers
        bar.append("text")
            .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .attr("y", function () {
                if (ref) return yPos - 10 + 65;
                else return yPos - 10;
            })
            .html(pupilCount)
            .attr("class", "barNumbers")
            .classed(barNo, true)
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .duration(transition)
            .style("opacity", function () {
                if (groupName === "bar13" || groupName === "bar14") {
                    return 0;
                } else {
                    return 1;
                }
            })

    }

    function moveBarNumber(barNo, xDiff) {

        d3.select(barNo)
            .transition()
            .duration(transition)
            .attr("x", function () {
                var cX = d3.select(this).attr("x");
                return cX - xDiff;

            })
            .style("opacity", 1)

    }

    $("document").ready(function () {
        // slide setup
        var slideWidth = $("#slides").width();
        var chartWidth = $("#chart").width();

        $(".slide").height(window.innerHeight);
        $("#slides").css("left", window.innerWidth / 2 - slideWidth / 2 + "px");
        $("#chart").css("left", (window.innerWidth / 2 - (chartWidth / 2)) + "px");
        $("#slides").css("opacity", 1);
        $("#chart").css("opacity", 1);

    });

    function scrollInit() {

        scroller
            .setup({
                step: '.step',
                offset: 0.7,
                debug: false
                // progress: true
            })
            .onStepEnter(handleStepEnter)

    }

    d3.csv("students.csv", function (data) {
        data.forEach(function (d) {
            d.pupils = +d.pupils / gradeBuckets;
        })

        addCircles(data[0].pupils, "grade1");
        addCircles(data[0].pupils, "grade1ref");

        for (var c = 1; c < 14; c++) {
            var i = c + 1;

            addCircles(data[c].pupils, "grade" + i, "#045a8d")

        }

        var count = d3.selectAll(".grade2").size();

    })

    var slideTwoDone = false,
        slideThreeDone = false,
        slideFourDone = false,
        slideFiveDone = false,
        slideFiveTwoDone = false,
        slideSixDone = false,
        slideSevenDone = false,
        slideEightDone = false,
        slideNineDone = false,
        slideElevenDone = false,
        slideTwelveDone = false,
        slideThirteenDone = false,
        slideFourteenDone = false,
        slideFifteenDone = false,
        slideSixteenDone = false,
        slideSeventeenDone = false, 
        slideEighteenDone = false, 
        slideNineteenDone = false; 


    //////////////////////////////////////////////////////////// SCROLLAMA

    function handleStepEnter(response) {

        var el = d3.select(response.element);
        var val = el.attr('data-step');

        switch (val) {
            case 'slide1':
                console.log('slide1');
                if (ignoreTrigger) {

                } else if (response.direction === "up") {
                    slideTwoDone = false;
                    // spreadCirclesReverse();
                    d3.selectAll(".grade1")
                        .transition()
                        .delay(randomInt(5, 500))
                        .duration(transition)
                        .style("opacity", 0)

                    break;
                }
            case 'slide2':
                console.log('slide2');

                if (response.direction === "down") {
                    slideTwoDone = true;
                    spreadCircles();
                    ignoreTrigger = false;

                } else {
                    if (!ignoreTrigger) {
                        slideThreeDone = false;
                        slide_three_reverse();
                    }

                }
                break;

            case 'slide3':
                console.log('slide3');

                if (response.direction === "down") {
                    slideThreeDone = true;
                    slide_three()

                } else {
                    slideFourDone = false;
                    slide_four_reverse();
                }
                break;


            case 'slide4':
                console.log('slide4');

                if (response.direction === "down") {
                    slideFourDone = true;
                    slide_four()
                } else {
                    slideFiveDone = false;
                    slide_five_reverse();
                }
                break;

            case 'slide5':
                console.log('slide5');

                if (response.direction === "down") {
                    slideFiveDone = true;
                    slide_five();
                } else {
                    slideFiveTwoDone = false;
                    slide_five_two_reverse();
                }
                break;

            case 'slide5-2':
                console.log('slide5-2');

                if (response.direction === "down") {
                    slideFiveTwoDone = true;
                    slide_five_two();
                }
                break;

            case 'slide5-3':
                console.log('slide5-3');

                if (response.direction === "up") {
                    slideSixDone = true;
                    slide_six_reverse();
                }
                break;

            case 'slide6':
                console.log('slide6');

                if (response.direction === "down") {
                    slideSixDone = true;
                    slide_six();
                } else {
                    slideSevenDone = false;
                    slide_seven_reverse();
                }
                break;

            case 'slide7':
                console.log('slide7');

                if (response.direction === "down") {
                    slideSevenDone = true;
                    slide_seven();
                } else {
                    slideEightDone = false;
                    slide_eight_reverse();
                }
                break;

            case 'slide8':
                console.log('slide8');

                if (response.direction === "down") {
                    slideEightDone = true;
                    slide_eight();
                } else {
                    slideNineDone = false;
                    slide_nine_reverse();
                }
                break;

            case 'slide9':
                console.log('slide9');

                if (response.direction === "down") {
                    slideNineDone = true;
                    slide_nine();
                }
                break;

            case 'slide10':
                console.log('slide10');

                if (response.direction === "up") {
                    slide_eleven_reverse()
                }
                break;

            case 'slide11':
                console.log('slide11');

                if (response.direction === "down") {
                    slide_eleven();
                } else {
                    slide_twelve_reverse();
                }
                break;

            case 'slide12':
                console.log('slide12');

                if (response.direction === "down") {

                    slide_twelve();
                } else {
                    slide_thirteen_reverse();
                }
                break;

            case 'slide13':
                console.log('slide13');

                if (response.direction === "down") {

                    slide_thirteen();
                } else {
                    slide_fourteen_reverse();
                }
                break;

            case 'slide14':
                console.log('slide14');

                if (response.direction === "down") {

                    slide_fourteen();

                }
                break;

            case 'slide15':
                console.log('slide15');

                if (response.direction === "down") {

                    slide_fifteen();

                }
                break;

            case 'slide16':
                console.log('slide16');

                if (response.direction === "down") {
                    slide_sixteen();
                }
                else { 
                    
                }
                break;

            case 'slide17':
                console.log('slide17');

                if (response.direction === "down") {
                    // slide_seventeen();
                }
                else { 
                    slide_nineteen_reverse();
                }
                break;
            case 'slide18':
                console.log('slide18');

                if (response.direction === "down") {
                    slide_nineteen();
                }
                
                
                break;

            case 'slide19':
                console.log('slide19');

                if (response.direction === "down") {
                    // slide_nineteen();
                }
                else { 
                    slide_twenty_reverse();
                }
                
                
                break;

            case 'slide20': 
                if(response.direction === "down") { 
                    slide_twenty();

                }
                

        }
    }

    function slide_three() {

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width - 100)
            .attr("y1", height - 28)
            .attr("y2", height - 28)
            .attr("class", "graph-line")
            .style("stroke", "#fff")
            .style("stroke-width", 1)
            .style("opacity", 0)
            .transition()
            .duration(transition)
            .style("opacity", 0.7)

        makeBars(".bar1", ".grade1", "barNo1", "1,207,996", "Gr1 (2005)", ".label1", true);

    }

    function slide_three_reverse() {

        svg.selectAll("line")
            .transition()
            .duration(transition)
            .style("opacity", 0)

        svg.selectAll(".barLabels")
            .remove()
        svg.selectAll(".barNumbers")
            .remove();

        spreadCirclesReverse();
        svg.selectAll(".grade1")
            .style("opacity", 1)

    }

    function slide_four() {

        if (slide4reverse) {
            var selects = ".grade2group, .grade3group, .grade4group, .grade5group, .grade6group, .grade7group";
            svg.selectAll(selects).transition().duration(transition * 3).style("opacity", 1);
        } else {
            makeBars("bar2", ".grade2", "barNo2", "1,056,241", "Gr2 (2006)", ".label2", false)
            makeBars("bar3", ".grade3", "barNo3", "1,040,022", "Gr3 (2007)", ".label3", false)
            makeBars("bar4", ".grade4", "barNo4", "1,023,963", "Gr4 (2008)", ".label4", false)
            makeBars("bar5", ".grade5", "barNo5", "980,945", "Gr5 (2009)", ".label5", false)
            makeBars("bar6", ".grade6", "barNo6", "948,213", "Gr6 (2010)", ".label6", false)
            makeBars("bar7", ".grade7", "barNo7", "910,994", "Gr7 (2011)", ".label3", false, true)

        }

    }

    function slide_four_reverse() {

        var selects = ".grade2group, .grade3group, .grade4group, .grade5group, .grade6group, .grade7group";
        svg.selectAll(selects).transition().duration(transition * 3).style("opacity", 0);
        d3.selectAll(".grade1").transition().duration(transition).style("fill", "#fffcbc").style("opacity", 1);

        slide4reverse = true;
    }


    function slide_five() {

        if (slide5reverse) {
            var selects = ".grade8group, .grade9group, .grade10group, .grade11group, .grade12group";
            svg.selectAll(selects).transition().delay(randomInt(5, 500)).duration(transition).style("opacity", 1);

            var selects2 = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
            d3.selectAll(selects2).transition().duration(1000).style("opacity", 0.5);

        } else {
            makeBars("bar8", ".grade8", "barNo8", "934,588", "Gr8 (2012)", ".label7", false)
            makeBars("bar9", ".grade9", "barNo9", "1,036,555", "Gr9 (2013)", ".label9", false)
            makeBars("bar10", ".grade10", "barNo10", "1,100,877", "Gr10 (2014)", ".label8", false)
            makeBars("bar11", ".grade11", "barNo11", "890,971", "Gr11 (2015)", ".label11", false)
            makeBars("bar12", ".grade12", "barNo12", "665,355", "Gr12 (2016)", ".label12", false, true)
            makeBars("bar13", ".grade13", "barNo13", "442,672", "", ".label13", false)
            makeBars("bar14", ".grade14", "barNo14", "162,374", "", ".label14", false)

            setTimeout(function () {
                var selects2 = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
                d3.selectAll(selects2).transition().duration(1000).style("opacity", 0.5);

            }, 100)
        }

    }

    function slide_five_reverse() {

        setTimeout(function () {
            var selects = ".grade1, .grade2, .grade3, .grade4, .grade5, .grade6, .grade7";
            d3.selectAll(selects).transition().duration(1000).style("opacity", 1);

        }, 100)

        var selects2 = ".grade8group, .grade9group, .grade10group, .grade11group, .grade12group";
        svg.selectAll(selects2).transition().delay(randomInt(5, 500)).duration(transition).style("opacity", 0);
        slide5reverse = true;
    }

    function slide_five_two() {

        var selects = ".grade8, .grade11, .grade12";
        d3.selectAll(selects).transition().duration(1000).style("opacity", 0.5);

    }

    function slide_five_two_reverse() {

        var selects = ".grade8, .grade11, .grade12";
        d3.selectAll(selects).transition().duration(1000).style("opacity", 1);

    }

    function slide_six() {

        var origX12 = d3.select(".grade12").attr("cx");
        var xDiff = origX12 - width / 2 + 40;

        // clear intermediate bars
        for (var c = 2; c < 12; c++) {

            d3.selectAll(".grade" + c)
                .transition()
                .duration(transition)
                .style("opacity", 0)

        }

        d3.selectAll(".barLabels").style("opacity", 0);
        d3.selectAll(".barNumbers")
            .classed("barremove", function (d, i) {
                if (i > 0 && i < 11) {
                    return true;
                }
            })

        d3.selectAll(".barremove").style("opacity", 0);

        // move grade 12 bar
        var labelX;
        var lineX = 0,
            lineY = 3000;

        d3.selectAll(".grade12")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = +d3.select(this).attr("cy");

                d3.select(this).transition().delay(function (d, i) {
                        return randomInt(200, 1000);
                    })
                    .duration(transition).attr("cx", function () {
                        curX - xDiff > lineX ? lineX = curX - xDiff : lineX = lineX;
                        curY < lineY ? lineY = curY : lineY = lineY;
                        slide9Grade12.push({
                            x: curX - xDiff,
                            y: curY
                        })
                        return curX - xDiff;
                    })
                    .style("opacity", 1)
                    .style("fill", "#31D5E8")

            });

        percentLines.push({
            x: lineX,
            y: +lineY
        })

        // move grade 12 labels
        d3.selectAll(".barNumbers")
            .classed("barNumbersTwo", function (d, i) {
                if (i === 11) return true;
                else return false;
            })
        d3.selectAll(".barNumbers")
            .classed("barNumbersOne", function (d, i) {
                if (i === 0) return true;
                else return false;
            })

        d3.select(".barNumbersOne").transition().duration(transition).attr("x", width / 2 - 60).style("text-anchor", "end");
        d3.select(".barNumbersTwo").transition().duration(transition).attr("x", width / 2 - 30).style("text-anchor", "start");

        var startXpos = d3.select(".grade1").attr("cx");
        var xDiff = width / 2 - startXpos;

        var newX;
        var newStartX = newX = width / 2 - (radius * 2 + spacing) * (colLimit + 2) - 40,
            newY = height - 30,
            colCount = 0;

        // line markers
        var lineX = 0,
            lineY;

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this).transition()
                    .delay(function () {

                        return randomInt(200, 1000);

                    })
                    .duration(transition).attr("cx", newX).attr("cy", function () {
                        newX > lineX ? lineX = newX : lineX = lineX;
                        lineY = newY;
                        slide9Grade1.push({
                            x: newX,
                            y: newY
                        })
                        return newY;
                    })
                    .style("opacity", 1)

                newX = newX + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    newX = newStartX;
                    colCount = 0;
                    newY = newY - spacing - radius * 2;
                }

            })

        percentLines.push({
            x: lineX,
            y: lineY
        })

        if (!slide6reverse) {
            // ADD legend
            var legend = svg.append("g").attr("class", "legend1");

            legend.append("rect")
                .attr("x", 50)
                .attr("y", window.innerHeight / 3)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "#FDFFB9")

            legend.append("text")
                .attr("x", 70)
                .attr("y", window.innerHeight / 3 + 10)
                .style("fill", "#FDFFB9")
                .text("STARTED GRADE 1")
                .style("font-size", "75%")

            legend.append("rect")
                .attr("x", 50)
                .attr("y", window.innerHeight / 3 + 20)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "#31D5E8")

            legend.append("text")
                .attr("x", 70)
                .attr("y", window.innerHeight / 3 + 30)
                .style("fill", "#31D5E8")
                .text("STARTED GRADE 12")
                .style("font-size", "75%")

        } else {
            d3.select(".legend1").style("opacity", 1);
        }

    }

    function slide_six_reverse() {

        //move grade 1 to start
        var newX = 0;
        var newStartX = newX;

        var newY = height - 30,
            colCount = 0;

        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this).transition()
                    .delay(function () {

                        return randomInt(200, 1000);

                    })
                    .duration(transition).attr("cx", newX).attr("cy", newY)

                newX = newX + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    newX = newStartX;
                    colCount = 0;
                    newY = newY - spacing - radius * 2;
                }

            })

        var newStartX = newX = startPositions[10] + (radius * 2 + spacing) * (colLimit + 2);
        var newY = height - 30,
            colCount = 0;

        d3.selectAll(".grade12")
            .each(function (d, i) {
                d3.select(this).transition()
                    .delay(function () {

                        return randomInt(200, 1000);

                    })
                    .duration(transition).attr("cx", newX).attr("cy", newY)
                    .style("fill", "#FDFFB9")

                newX = newX + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    newX = newStartX;
                    colCount = 0;
                    newY = newY - spacing - radius * 2;
                }

            })

        d3.select(".legend1").style("opacity", 0);
        d3.select(".legend2").style("opacity", 0);
        d3.select(".legend3").style("opacity", 0);


        // move bar Numebrs
        d3.select(".barNumbersOne").transition().duration(transition).attr("x", startPositions[0]).style("text-anchor", "start");
        d3.select(".barNumbersTwo").transition().duration(transition).attr("x", startPositions[11]).style("text-anchor", "start");

        d3.selectAll(".barremove").style("opacity", 1);
        for (var x = 2; x < 12; x++) {
            svg.selectAll(".grade" + x).transition().delay(500).duration(transition).style("opacity", 1);
        }

        slide6reverse = true;

    }

    function slide_seven() {

        var getStartX = d3.select(".grade12").attr("cx");
        var curX = d3.select(".grade13").attr("cx");
        var startXdiff = curX - getStartX;
        var xDiff = curX - getStartX - (radius * 2 + spacing) * (colLimit + 2);
        // var newLabelX = getStartX + (radius * 2 + spacing) * (colLimit + 2);

        var lineX = 0,
            lineY = 3000;

        d3.selectAll(".grade13")

            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = d3.select(this).attr("cy");

                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 1)
                    .attr("cx", function () {
                        curX - xDiff > lineX ? lineX = curX - xDiff : lineX = lineX;
                        curY < lineY ? lineY = curY : lineY = lineY;
                        slide9passed.push({
                            x: curX - xDiff,
                            y: curY
                        })
                        return curX - xDiff;
                    })
            })

        percentLines.push({
            x: lineX,
            y: lineY
        })

        moveBarNumber(".barNo13", xDiff);

        if (!slide7reverse) {

            var legend = svg.append("g").attr("class", "legend2");

            legend.append("rect")
                .attr("x", 50)
                .attr("y", window.innerHeight / 3 + 40)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "#fff")

            legend.append("text")
                .attr("x", 70)
                .attr("y", window.innerHeight / 3 + 50)
                .style("fill", "#fff")
                .text("PASSED MATRIC")
                .style("font-size", "75%")

        } else {
            d3.select(".legend2").style("opacity", 1);
        }

    }

    function slide_seven_reverse() {

        

        var curX = d3.select(".grade13").attr("cx");
        var endX = startPositions[12];
        var xDiff = endX - curX;

        d3.selectAll(".grade13")
            .each(function (d, i) {
                var curX = +d3.select(this).attr("cx");
                curX.toFixed(2);

                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 0)
                    .attr("cx", curX + xDiff)
            })

        // move bar number
        var textPos = endX + ((radius * 2 + spacing) * colLimit) / 2;
        d3.select(".barNo13")
            .transition().duration(1000).attr("x", textPos).style("text-anchor", "middle").style("opacity", 0);

        d3.select(".legend2").style("opacity", 0);

        slide7reverse = true;
    }

    function slide_eight() {

        var getStartX = d3.select(".grade13").attr("cx");
        var curX = d3.select(".grade14").attr("cx");
        var xDiff = curX - getStartX - (radius * 2 + spacing) * (colLimit + 2);
        //get diff
        var lineX = 0,
            lineY = 3000;

        d3.selectAll(".grade14")

            .each(function (d, i) {

                var curX = d3.select(this).attr("cx");
                var curY = d3.select(this).attr("cy");
                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 1)
                    .attr("cx", function () {
                        curX - xDiff > lineX ? lineX = curX - xDiff : lineX = lineX;
                        curY < lineY ? lineY = curY : lineY = lineY;
                        slide9university.push({
                            x: curX - xDiff,
                            y: curY
                        })
                        return curX - xDiff;
                    })

            })

        percentLines.push({
            x: lineX,
            y: lineY
        })

        moveBarNumber(".barNo14", xDiff);

        // add percent lines
        if (pLinesExist) {
            pLines.transition().duration(transition).style("opacity", 1);
        } else {
            percentLines.forEach(function (d, i) {
                addPercentLines(d.x, d.y, i);

            })
            pLinesExist = true;
        }

        // get positions
        d3.selectAll(".grade1")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = d3.select(this).attr("cy");
                gradeOneMarkers.push({
                    x: curX,
                    y: curY
                })

            });

        d3.selectAll(".grade12")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = d3.select(this).attr("cy");
                gradeTwelveMarkers.push({
                    x: curX,
                    y: curY
                })

            });

        d3.selectAll(".grade13")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = d3.select(this).attr("cy");
                gradeThirteenMarkers.push({
                    x: curX,
                    y: curY
                })

            });

        d3.selectAll(".grade14")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx"),
                    curY = d3.select(this).attr("cy");
                gradeFourteenMarkers.push({
                    x: curX,
                    y: curY
                })

            });

        if (!slide8reverse) {
            var legend = svg.append("g").attr("class", "legend3");

            legend.append("rect")
                .attr("x", 50)
                .attr("y", window.innerHeight / 3 + 60)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "lightgreen")

            legend.append("text")
                .attr("x", 70)
                .attr("y", window.innerHeight / 3 + 70)
                .style("fill", "lightgreen")
                .text("GOT A UNIVERSITY ENTRANCE")
                .style("font-size", "75%")

        } else {
            d3.select(".legend3").style("opacity", 1);
        }

    }

    function slide_eight_reverse() {

        

        pLines.transition().duration(transition * 3).style("opacity", 0);

        var curX = d3.select(".grade14").attr("cx");
        var endX = startPositions[12];
        var xDiff = endX - curX;

        d3.selectAll(".grade14")
            .each(function (d, i) {
                var curX = +d3.select(this).attr("cx");
                curX.toFixed(2);

                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 0)
                    .attr("cx", curX + xDiff)
            })

        // move bar number
        var textPos = endX + ((radius * 2 + spacing) * colLimit) / 2;
        d3.select(".barNo14")
            .transition().duration(1000).attr("x", textPos).style("text-anchor", "middle").style("opacity", 0);

        d3.select(".legend3").style("opacity", 0);

        slide8reverse = true;

    }

    function slide_nine() {

        var selects = ".grade1, .grade12, .grade13, .grade14, .legend1, .legend2, .legend3, .graph-line, .barNumbers";

        d3.selectAll(selects)
            .transition()
            .delay(randomInt(5, 500))
            .duration(transition)
            .style("opacity", 0);

        pLines.transition().duration(transition * 2).style("opacity", 0);

        slideNineRun = true;

    }

    function slide_nine_reverse() {
        oneHundred.transition().duration(1000).style("opacity", 0);

        var selects = ".graph-line, .grade1, .grade12, .grade13, .grade14, .barNo1, .barNo12, .barNo13, .barNo14, .legend1, .legend2, .legend3";

        d3.selectAll(selects)
            .transition()
            .delay(randomInt(5, 500))
            .duration(transition)
            .style("opacity", 1);

        pLines.transition().duration(transition * 2).style("opacity", 1);

    }

    function addPercentLines(x, y, i) {

        pLines.append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", y)
            .attr("y2", y)
            .style("stroke", "#11abc6")
            .style("stroke-width", 1)
            .style("shape-rendering", "crispEdges")
            .style("stroke-dasharray", "3, 3")
            .transition()
            .duration(transition * 3)
            .attr("x2", percentLines[3].x + 40);

        pLines.append("text")
            .attr("x", percentLines[3].x + 45)
            .attr("y", y)
            .text(percentages[i] + "%")
            .style("font-size", "80%")

    }

    var newCircles;

    function slide_fifteen() {

        var selects = ".grade1, .grade12, .grade13, .grade14, .legend1, .legend2, .legend3, .graph-line, .barNumbers";

        d3.selectAll(selects)
            .transition()
            .delay(randomInt(5, 500))
            .duration(transition)
            .style("opacity", 0);

        pLines.transition().duration(transition * 2).style("opacity", 0);
        
        var selects = ".end-bar-two, .end-bar-three, .end-bar-four, .grade1, .label-holder";
        d3.select(selects).transition().duration(500).style("opacity", 0);

       if(!slideFifteenDone) {
        // add 100 circles
        newCircles = {
            radius: 7,
            startX: 0,
            startY: 0,
            spacing: 5,
            cols: 10,
            rows: 10,
            curX: 0,
            curY: height - 30,
            col: 0,
            row: 0
        }

        newCircles.startX = newCircles.curX = width / 2 - (newCircles.cols / 2 * (newCircles.radius * 2 + newCircles.spacing));

        oneHundred = svg.append("g").attr("class", "one-hundred");

        for (var c = 0; c < 100; c++) {
            oneHundred.append("circle")
                .attrs({
                    cx: newCircles.curX,
                    cy: newCircles.curY,
                    r: newCircles.radius,
                    class: "the-hundred"
                })
                .style("fill", "none")
                .style("stroke", "#fff")
                .style("stroke-width", 2)
                .style("opacity", 0)
                .transition()
                .delay(randomInt(50, 800))
                .style("opacity", 1)

            if (newCircles.col < newCircles.cols - 1) {
                newCircles.col++;
                newCircles.curX += (newCircles.radius * 2) + newCircles.spacing;
            } else {
                newCircles.col = 0;
                newCircles.row++;
                newCircles.curX = newCircles.startX;
                newCircles.curY -= (newCircles.radius * 2) + newCircles.spacing;
            }

        }
    }
    // else { 
    //     oneHundred.transition()
    // }
slideFifteenDone = true;
    }

    var block2x;

    function slide_sixteen() {

        

        var curX = width / 2 - 120,
            curY = height - 30,
            col = 0,
            incr = newCircles.radius * 2 + newCircles.spacing;

        var curX2 = width / 2 - 80,
            curY2 = height - 30,
            col2 = 0;

        var curX3 = width / 2 + 20,
            curY3 = height - 30,
            col3 = 0;
        
        var curX4 = width / 2 + 120,
            curY4 = height - 30,
            col4 = 0;

        d3.selectAll(".the-hundred")
            .each(function (d, i) {

                if (i < 45) {
                    d3.select(this)
                        .attr("class", "block1")
                        .transition()
                        .delay(randomInt(50, 500))
                        .duration(500)
                        .attr("cx", curX)
                        .attr("cy", curY)
                        .style("stroke", "lightsteelblue")
                        .style("fill", "lightsteelblue")

                    if (col < 3) {
                        col++;
                        curX -= incr;
                    } else {
                        col = 0;
                        curY -= incr;
                        curX = width / 2 - 120;
                    }
                }

                if (i > 44 && i < 64) {
                    d3.select(this)
                        .attr("class", "block2")
                        .transition()
                        .delay(randomInt(50, 500))
                        .duration(500)
                        .attr("cx", curX2)
                        .attr("cy", curY2)
                        .style("stroke", "#FDFFB9")
                        .style("fill", "#FDFFB9")

                    if (col2 < 3) {
                        col2++;
                        curX2 += incr;
                    } else {
                        col2 = 0;
                        curY2 -= incr;
                        curX2 = width / 2 - 80;
                    }
                }

                if (i > 63 && i < 87) {
                    d3.select(this)
                        .attr("class", "block3")
                        .transition()
                        .delay(randomInt(50, 500))
                        .duration(500)
                        .attr("cx", curX3)
                        .attr("cy", curY3)
                        .style("stroke", "lightpink")
                        .style("fill", "lightpink")
                        

                    if (col3 < 3) {
                        col3++;
                        curX3 += incr;
                    } else {
                        col3 = 0;
                        curY3 -= incr;
                        curX3 = width / 2 + 20;
                    }
                }

                if (i > 86) {
                    d3.select(this)
                        .attr("class", "block4")
                        .transition()
                        .delay(randomInt(50, 500))
                        .duration(500)
                        .attr("cx", curX4)
                        .attr("cy", curY4)
                        .style("stroke", "limegreen")
                        .style("fill", "limegreen")

                    if (col4 < 3) {
                        col4++;
                        curX4 += incr;
                    } else {
                        col4 = 0;
                        curY4 -= incr;
                        curX4 = width / 2 + 120;
                    }
                }

            })

        // ADD LABELS BLOCK1
        setTimeout(function () {

            var pos = getBlockPoints(".block1");

            // var labels = svg.append("g").attr("class", "l1");

            oneHundred.append("text")
                .attr("x", pos.left - newCircles.radius)
                .attr("y", +pos.bottom + 30)
                .text("Did not reach grade 12")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "middle")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")

        }, 1000);

        // ADD LABELS BLOCK2
        setTimeout(function () {

            var pos = getBlockPoints(".block2");

            // var labels = svg.append("g").attr("class", "l2");

            oneHundred.append("text")
                .attr("class", "block2label")
                .attr("x", pos.left - newCircles.radius)
                .attr("y", +pos.bottom + 30)
                .text("Failed G12")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "start")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")

        }, 1000);

        // ADD LABELS BLOCK3
        setTimeout(function () {

            var pos = getBlockPoints(".block3");

           

            oneHundred.append("text")
                .attr("class", "block3label")
                .attr("x", pos.left - newCircles.radius)
                .attr("y", +pos.bottom + 30)
                .text("Passed G12")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "start")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")

        }, 1000);

        // ADD LABELS BLOCK4
        setTimeout(function () {

            var pos = getBlockPoints(".block4");

            // var labels = svg.append("g").attr("class", "l2");

            oneHundred.append("text")
                .attr("class", "block4label")
                .attr("x", pos.left - newCircles.radius)
                .attr("y", +pos.bottom + 30)
                .text("University entrance pass")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "start")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")

        }, 1000);

    }

   

    function slide_nineteen() {

    var b1x = +d3.select(".block1").attr("cx"),
        b1y = +d3.select(".block1").attr("cy"),
        b1r = +d3.select(".block1").attr("r"),
        b2x = +d3.select(".block2").attr("cx"),
        b2y = +d3.select(".block2").attr("cy"),
        b2r = +d3.select(".block2").attr("r"),
        b3x = +d3.select(".block3").attr("cx"),
        b3y = +d3.select(".block3").attr("cy"),
        b3r = +d3.select(".block3").attr("r");

    var b1y = d3.select(".block1").attr("cy"),
        b2y = d3.select(".block2").attr("cy"),
        b3y = d3.select(".block3").attr("cy");

    var barWidth = 20,
        barSpace = 10,
        barWidth1 = 40,
        barWidth2 = 40,
        barWidth3 = 40,
        barRatio = 3 * 0.7;

    var barTotalWidth = barWidth1 * barRatio + barWidth2 * barRatio + barWidth3 * barRatio + barSpace * 2; 

    var bar1x = width/2 - barTotalWidth / 2;
    var bar2x = bar1x + barWidth1 * barRatio + barSpace; 
    var bar3x = bar2x + barWidth2 * barRatio + barSpace;

    var no_matric_unemployed = 33, 
        matric_unemployed = 28, 
        tertiary_unemployed = 17, 
        university_unemployed = 7;


    employed = svg.append("g").attr("class", "employed");

    // var r = 6, 
    //     x = b1x,
    //     y = b1y,
    //     s = 2, 
    //     c = 5,
    //     curX,
    //     curY,
    //     col = 0;

    employed = svg.append("g").attr("class", "employed");

    employed.append("rect")
        .attr("class", "eb1")
        .attr("x", bar1x)
        .attr("y", b1y)
        .attr("width", barWidth1 * barRatio)
        .attr("height", 0)
        .style("opacity", 0)
        .style("fill", "#fff")

    employed.append("rect")
        .attr("class", "eb2")
        .attr("x", bar2x)
        .attr("y", b1y)
        .attr("width", barWidth2 * barRatio)
        .attr("height", 0)
        .style("opacity", 0)
        .style("fill", "#fff")

    employed.append("rect")
        .attr("class", "eb3")
        .attr("x", bar3x)
        .attr("y", b1y)
        .attr("width", barWidth3 * barRatio)
        .attr("height", 0)
        .style("opacity", 0)
        .style("fill", "#fff")

    employed.append("rect")
        .attr("class", "e1")
        .attr("x", bar1x)
        // .attr("y", b1y)
        .attr("width", barWidth1 * barRatio)
        // .attr("height", 0)
        .attr("height", (100 - no_matric_unemployed) * 3 * 0.7)
            .attr("y", b1y - (100 - no_matric_unemployed) * 3 * 0.7 - 20)
        .style("fill", "#AEC3E0")
        .style("opacity", 0)
        
    
    employed.append("rect")
        .attr("class", "e2")
        .attr("x", bar2x)
        .attr("y", b2y - 67 * 3)
        .attr("width", barWidth2 * barRatio)
        .attr("height", 0)
        .style("fill", "lightpink")
        .style("opacity",0)
        
    employed.append("rect")
        .attr("class", "e3")
        .attr("x", bar3x)
        .attr("y", b3y)
        .attr("width", barWidth3 * barRatio)
        .attr("height", 0)
        .style("fill", "limegreen")
        .style("opacity", 0)
      
    setTimeout( function () { 
        oneHundred
            .transition()
            .duration(2000)
            .style("opacity", 0);

        employed.select(".eb1")
            .transition()
            .duration(2000)
            .style("opacity", 0.2)
            .attr("height", 100 * 3 * 0.7)
            .attr("y", b1y - 100 * 3 * 0.7 - 20)

        employed.append("text")
            .attr("x", bar1x - 20)
            .attr("y", b1y - 190)
            .text("UNEMPLOYED")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .style("text-anchor", "end")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.append("text")
            .attr("x", bar1x - 20)
            .attr("y", b1y - 70)
            .text("EMPLOYED")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .style("text-anchor", "end")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.append("text")
            .attr("x", bar1x + (barWidth1 / 2) * barRatio)
            .attr("y", b1y - 70)
            .text("67%")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .style("font-size", "150%")
            .style("text-anchor", "middle")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.append("text")
            .attr("x", bar2x + (barWidth2 / 2) * barRatio)
            .attr("y", b1y - 70)
            .text("72%")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .style("font-size", "150%")
            .style("text-anchor", "middle")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.append("text")
            .attr("x", bar3x + (barWidth3 / 2) * barRatio)
            .attr("y", b1y - 70)
            .text("93%")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .style("font-size", "150%")
            .style("text-anchor", "middle")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)


// bar labels
        employed.append("text")
            .attr("x", bar1x + barWidth1 / 2)
            .attr("y", b1y)
            .text("No Matric")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            // .style("text-anchor", "end")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)
            

        employed.append("text")
            .attr("x", bar2x + barWidth2 / 2)
            .attr("y", b1y)
            .text("Matric")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            // .style("text-anchor", "end")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.append("text")
            .attr("x", bar3x + barWidth3 / 2)
            .attr("y", b1y)
            .text("University")
            .style("stroke", "none")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            // .style("text-anchor", "end")
            .transition() 
            .delay(2000)
            .duration(1000)
            .style("opacity", 1)

        employed.select(".eb2")
            .transition()
            .duration(2000)
            .style("opacity", 0.2)
            .attr("height", 100 * 3 * 0.7)
            .attr("y", b1y - 100 * 3 * 0.7 - 20)

        employed.select(".eb3")
            .transition()
            .duration(2000)
            .style("opacity", 0.2)
            .attr("height", 100 * 3 * 0.7)
            .attr("y", b1y - 100 * 3 * 0.7- 20)
        
        employed.select(".e1")
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .attr("height", (100 - no_matric_unemployed) * 3 * 0.7)
            .attr("y", b1y - (100 - no_matric_unemployed) * 3 * 0.7 - 20)
            
            
            
            
        employed.select(".e2")
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .attr("height", (100 - matric_unemployed) * 3 * 0.7)
            .attr("y", b1y - (100 - matric_unemployed) * 3 * 0.7 - 20)
            

        employed.select(".e3")
            .transition()
            .duration(2000)
            .style("opacity", 1)
            .attr("height", (100 - university_unemployed) * 3 * 0.7)
            .attr("y", b1y - (100 - university_unemployed) * 3 * 0.7 - 20)
            
            

    }, 200);

    setTimeout( function () { 
        d3.select(".e1")
            .on("mouseover", function () { 
                console.log("mouseover");
            })
    }, 1000);

    }


    function slide_nineteen_reverse() {

    employed.transition().duration(1000).style("opacity", 0);

      console.log('slide 19 reverse');
      
        oneHundred
            .transition()
            .duration(1000)
            .style("opacity", 1);

    }



    function getBlockPoints(className) {
        var top = 10000,
            bottom = 0,
            left = 10000,
            right = 0;

        d3.selectAll(className)
            .each(function (d, i) {
                var x = d3.select(this).attr("cx")
                if (x < left) left = x;
                if (x > right) right = x;

                var y = d3.select(this).attr("cy");
                if (y < top) top = y;
                if (y > bottom) bottom = y;
            });

        return {
            top: top,
            bottom: bottom,
            left: left,
            right: right
        }

    }

    function slide_twenty () { 
        employed.transition().duration(1000).style("opacity", 0.2);
    }

    function slide_twenty_reverse() {
        employed.transition().duration(1000).style("opacity", 1);
    }

    $(window).on("beforeunload", function () {

        $(window).scrollTop(0);

    });

    $("document").ready(function () {
        setTimeout(function () {
            $(".loading").css("display", "none");
            $("html").css("overflow", "auto");
            scrollInit();
        }, 0);

        // set mobile warning
        if(window.outerWidth < 600) { 
        
        $(".mobile-warn").css("visibility", "visible");
        var eHeight; 
        setTimeout( function () { 
            eHeight = $(".mobile-warn").height();
            console.log(eHeight);
            $(".mobile-warn").css("top", window.innerHeight / 2 - eHeight /2  + "px");
        },200);


        
        setTimeout( function () { 
            $(".mobile-warn").animate({ 
                opacity: 0.8
            }, 500);
            
        }, 1000);

        $(".dismiss").click( function () { 
            $(".mobile-warn").hide();
        })

        }
    });

})();



