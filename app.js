(function loadScript () {
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
        mobile = false;

    // mobile
    if(windowWidth < 651) { 
        width = window.outerWidth - 50,
        height = window.outerHeight - 50,
        gradeBuckets = 7000,
        radius = 2,
        spacing = 1.3, 
        colLimit = 7,
        mobile = true; 

    }

    var percentages = [ 55, 100, 37, 13 ];

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

        var testData = d3.range(0,100);

        var dWidth = 50 * 6 + (49 * spacing);
    
        if(mobile) { var origX = xx = (width - dWidth) / 3; }
        else { var origX = xx = (width - dWidth) / 2; }

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

    function scrollInit () { 
        
    scroller
        .setup({
            step: '.step', 
            offset: 0.3, 
            debug: true, 
            progress: true
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
        slideFourteenDone = false;

//////////////////////////////////////////////////////////// SCROLLAMA
    
        function handleStepEnter (response) {
           
            var el = d3.select(response.element);
            var val = el.attr('data-step');
                       
            switch (val) { 
                case 'slide1': 
                   
                    if(ignoreTrigger) { 

                    }
                    else if(response.direction === "up" ) { 
                        slideTwoDone = false; 
                        // spreadCirclesReverse();
                        d3.selectAll(".grade1")
                            .transition()
                            .delay( randomInt(5, 500))
                            .duration(transition)
                            .style("opacity", 0)

                        break;
                    }
                case 'slide2': 
                    if(response.direction === "down") { 
                        slideTwoDone = true;
                        spreadCircles();
                        ignoreTrigger = false;
                        
                    }
                    else { 
                        if(!ignoreTrigger) { 
                            slideThreeDone = false; 
                            slide_three_reverse();
                        }
                        
                    }
                    break;
                
                case 'slide3': 
                    if(response.direction === "down") { 
                        slideThreeDone = true; 
                        slide_three()
                        
                    }
                    else { 
                        slideFourDone = false;
                        slide_four_reverse();
                    }
                    break;

                
                case 'slide4': 
                    if(response.direction === "down") { 
                        slideFourDone = true; 
                        slide_four() 
                    }
                    else { 
                        slideFiveDone = false; 
                        slide_five_reverse();
                    }
                    break;

                case 'slide5': 
                    if(response.direction === "down") { 
                        slideFiveDone = true; 
                        slide_five();
                    }
                    else { 
                        slideFiveTwoDone = false; 
                        slide_five_two_reverse();
                    }
                    break;
                    
                case 'slide5-2': 
                    if(response.direction === "down") { 
                        slideFiveTwoDone = true; 
                        slide_five_two();
                    }
                //    else { 
                //         slideSixDone = false; 
                //         slide_six_reverse();
                //     } 
                    break;

                case 'slide5-3':
                    if(response.direction === "up") { 
                        slideSixDone = true; 
                        slide_six_reverse();
                    }
                    break;

                case 'slide6': 
                    if(response.direction === "down") { 
                        slideSixDone = true; 
                        slide_six();
                    }
                    else { 
                        slideSevenDone = false; 
                        slide_seven_reverse();
                    }
                    break;

                case 'slide7': 
                    if(response.direction === "down") { 
                        slideSevenDone = true; 
                        slide_seven();
                    }
                    else { 
                        slideEightDone = false; 
                        slide_eight_reverse();
                    }
                    break;
                    
                case 'slide8': 
                    if(response.direction === "down") { 
                        slideEightDone = true; 
                        slide_eight();
                    }
                    else { 
                        slideNineDone = false; 
                        slide_nine_reverse();
                    }
                    break;

                case 'slide9': 
                    if(response.direction === "down") { 
                        slideNineDone = true; 
                        slide_nine();
                    }
                    break; 

                case 'slide10':
                    if(response.direction === "up") { 
                        slide_eleven_reverse()
                    }
                    break;
                
                case 'slide11': 
                    if(response.direction === "down") { 
                        slide_eleven();
                    }
                    else { 
                        slide_twelve_reverse();
                    }
                    break; 

                case 'slide12': 
                    if(response.direction === "down") {
                        
                        slide_twelve(); 
                    }
                    else { 
                        slide_thirteen_reverse();
                    }
                    break; 

                case 'slide13': 
                    if(response.direction === "down") { 
                        
                        slide_thirteen();
                    }
                    else { 
                        slide_fourteen_reverse();
                    }
                    break;

                case 'slide14': 
                    if(response.direction === "down") { 
                        
                        slide_fourteen();
                        
                    }
                    break;

                case 'slide15': 
                    if(response.direction === "down") { 
                        
                        slide_fifteen();
                        
                    }
                    break;
               
                case 'slide16': 
                    if(response.direction === "down") { 
                        slide_sixteen();
                    }
                    break;

                case 'slide17': 
                    if(response.direction === "down") { 
                        slide_seventeen();
                    }
                    break;
                case 'slide18': 
                    if(response.direction === "down") { 
                        slide_eighteen();
                    }
                    break;

                case 'slide19': 
                    if(response.direction === "down") { 
                        slide_nineteen();
                    }
                    break;

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
            svg.selectAll(".grade2group").transition().duration(transition * 3).style("opacity", 1);
            svg.selectAll(".grade3group").transition().duration(transition * 3).style("opacity", 1);
            svg.selectAll(".grade4group").transition().duration(transition * 3).style("opacity", 1);
            svg.selectAll(".grade5group").transition().duration(transition * 3).style("opacity", 1);
            svg.selectAll(".grade6group").transition().duration(transition * 3).style("opacity", 1);
            svg.selectAll(".grade7group").transition().duration(transition * 3).style("opacity", 1);
            // d3.selectAll(".grade1").transition().duration(transition).style("fill", "#fff").style("opacity", 0.5);
        } else {
            makeBars("bar2", ".grade2", "barNo2", "1,056,241", "Gr2 (2006)", ".label2", false)
            makeBars("bar3", ".grade3", "barNo3", "1,040,022", "Gr3 (2007)", ".label3", false)
            makeBars("bar4", ".grade4", "barNo4", "1,023,963", "Gr4 (2008)", ".label4", false)
            makeBars("bar5", ".grade5", "barNo5", "980,945", "Gr5 (2009)", ".label5", false)
            makeBars("bar6", ".grade6", "barNo6", "948,213", "Gr6 (2010)", ".label6", false)
            makeBars("bar7", ".grade7", "barNo7", "910,994", "Gr7 (2011)", ".label3", false, true)
            // d3.selectAll(".grade1").style("fill", "white").style("opacity", "0.5");
            setTimeout( function () { 
                // d3.selectAll(".grade7").style("fill", "white");
                
                // d3.selectAll(".grade2").style("fill", "white").style("opacity", "0.5");
                // d3.selectAll(".grade3").style("fill", "white").style("opacity", "0.5");
                // d3.selectAll(".grade4").style("fill", "white").style("opacity", "0.5");
                // d3.selectAll(".grade5").style("fill", "white").style("opacity", "0.5");
                // d3.selectAll(".grade6").style("fill", "white").style("opacity", "0.5");

            }, 2000);
        }


    }

    function slide_four_reverse() {

        svg.selectAll(".grade2group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade3group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade4group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade5group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade6group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade7group").transition().duration(transition * 3).style("opacity", 0);
        d3.selectAll(".grade1").transition().duration(transition).style("fill", "#fffcbc").style("opacity", 1);


        slide4reverse = true;
    }


    function slide_five() {
        if (slide5reverse) {
            svg.selectAll(".grade8group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade9group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade10group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade11group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade12group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);


             
                d3.selectAll(".grade1").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade2").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade3").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade4").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade5").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade6").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade7").transition().duration(1000).style("opacity", 0.5);


           
        } else {
            makeBars("bar8", ".grade8", "barNo8", "934,588", "Gr8 (2012)", ".label7", false)
            makeBars("bar9", ".grade9", "barNo9", "1,036,555", "Gr9 (2013)", ".label9", false)
            makeBars("bar10", ".grade10", "barNo10", "1,100,877", "Gr10 (2014)", ".label8", false)
            makeBars("bar11", ".grade11", "barNo11", "890,971", "Gr11 (2015)", ".label11", false)
            makeBars("bar12", ".grade12", "barNo12", "665,355", "Gr12 (2016)", ".label12", false, true)
            makeBars("bar13", ".grade13", "barNo13", "442,672", "", ".label13", false)
            makeBars("bar14", ".grade14", "barNo14", "162,374", "", ".label14", false)

            setTimeout( function () { 
                d3.selectAll(".grade1").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade2").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade3").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade4").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade5").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade6").transition().duration(1000).style("opacity", 0.5);
                d3.selectAll(".grade7").transition().duration(1000).style("opacity", 0.5);


            }, 100)
        }

    }

    function slide_five_reverse() {
        setTimeout( function () { 
            d3.selectAll(".grade1").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade2").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade3").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade4").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade5").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade6").transition().duration(1000).style("opacity", 1);
            d3.selectAll(".grade7").transition().duration(1000).style("opacity", 1);


        }, 100)

        svg.selectAll(".grade8group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade9group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade10group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade11group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade12group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);

        slide5reverse = true;
    }

    function slide_five_two () { 

        d3.selectAll(".grade8").transition().duration(1000).style("opacity", 0.5);
        d3.selectAll(".grade11").transition().duration(1000).style("opacity", 0.5);
        d3.selectAll(".grade12").transition().duration(1000).style("opacity", 0.5);

        
    }

    function slide_five_two_reverse () { 

        d3.selectAll(".grade8").transition().duration(1000).style("opacity", 1);
        d3.selectAll(".grade11").transition().duration(1000).style("opacity", 1);
        d3.selectAll(".grade12").transition().duration(1000).style("opacity", 1);

    }



    function slide_six() {

        //        d3.select(".barNo14").style("opacity", 1)

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
                    .duration(transition).attr("cx", newX).attr("cy", function() { 
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


         if(!slide6reverse) {  
        // ADD legend
        var legend = svg.append("g").attr("class", "legend1");

        legend.append("rect")
            .attr("x", 50)
            .attr("y", window.innerHeight / 3)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill","#FDFFB9")

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
            .style("fill","#31D5E8")

        legend.append("text")
            .attr("x", 70)
            .attr("y", window.innerHeight / 3 + 30)
            .style("fill", "#31D5E8")
            .text("STARTED GRADE 12")
            .style("font-size", "75%")

         }
         else { 
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

    if(!slide7reverse) {

    var legend = svg.append("g").attr("class", "legend2");

    legend.append("rect")
        .attr("x", 50)
        .attr("y", window.innerHeight / 3 + 40)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill","#fff")

    legend.append("text")
        .attr("x", 70)
        .attr("y", window.innerHeight / 3 + 50)
        .style("fill", "#fff")
        .text("PASSED MATRIC")
        .style("font-size", "75%")

    }
    else { 
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
        if(pLinesExist) {
            pLines.transition().duration(transition).style("opacity", 1);
        }
        else { 
            percentLines.forEach( function (d, i) { 
               addPercentLines(d.x, d.y, i);
               
            })
            pLinesExist = true;
        }


        // get positions
        
                d3.selectAll(".grade1")
                    .each( function (d, i) { 
                        var curX = d3.select(this).attr("cx"),
                            curY = d3.select(this).attr("cy");
                        gradeOneMarkers.push({
                            x: curX,
                            y: curY
                        })
        
                    });

                d3.selectAll(".grade12")
                .each( function (d, i) { 
                    var curX = d3.select(this).attr("cx"),
                        curY = d3.select(this).attr("cy");
                    gradeTwelveMarkers.push({
                        x: curX,
                        y: curY
                    })
    
                });

                d3.selectAll(".grade13")
                .each( function (d, i) { 
                    var curX = d3.select(this).attr("cx"),
                        curY = d3.select(this).attr("cy");
                    gradeThirteenMarkers.push({
                        x: curX,
                        y: curY
                    })
    
                });

                d3.selectAll(".grade14")
                .each( function (d, i) { 
                    var curX = d3.select(this).attr("cx"),
                        curY = d3.select(this).attr("cy");
                    gradeFourteenMarkers.push({
                        x: curX,
                        y: curY
                    })
    
                });

            if(!slide8reverse) {
            var legend = svg.append("g").attr("class", "legend3");

            legend.append("rect")
                .attr("x", 50)
                .attr("y", window.innerHeight / 3 + 60)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill","lightgreen")
        
            legend.append("text")
                .attr("x", 70)
                .attr("y", window.innerHeight / 3 + 70)
                .style("fill", "lightgreen")
                .text("GOT A UNIVERSITY ENTRANCE")
                .style("font-size", "75%")  
                
            }
            else { 
                d3.select(".legend3").style("opacity", 1);
            }


   // get all positions

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


    function slide_nine () { 
        
        var selects = ".grade1, .grade12, .grade13, .grade14, .legend1, .legend2, .legend3, .graph-line, .barNumbers";

        d3.selectAll(selects)
            .transition()
            .delay(randomInt(5, 500))
            .duration(transition)
            .style("opacity", 0);

            pLines.transition().duration(transition * 2).style("opacity", 0);
           
            slideNineRun = true;

    }

    function slide_nine_reverse () { 

        var selects = ".graph-line, .grade1, .grade12, .grade13, .grade14, .barNo1, .barNo12, .barNo13, .barNo14, .legend1, .legend2, .legend3";

        d3.selectAll(selects)
            .transition()
            .delay( randomInt(5, 500))
            .duration(transition)
            .style("opacity", 1);
            
        pLines.transition().duration(transition * 2).style("opacity", 1);
       
    }

    function slide_eleven () { 
       
        if(mobile) { 
            var rectW = 8;
            var labelOffset = 18 
         }
         else { 
            var rectW = 12;
            labelOffset = 25;
         }
        
        var curY = d3.select(".grade1").attr("cy");

        var rectX;

        d3.selectAll(".grade1")
            .each( function (d, i) { 

                // get position for rect
                if(i === 59) { 
                    rectX = d3.select(this).attr("cx");
                }

                d3.select(this)
                    .transition()
                    .duration( randomInt(50, 500) )
                    .style("fill", function () { 
                        if(i < 60) { return "#FDFFB9"; }
                        else { return "#31D5E8"; }
                    })

            })

        if(!slideElevenDone) {

        // add rect
        var labels = svg.append("g").attr("class", "label-holder");

        labels.append("rect").attr("class", "rect1")
            .attr("x", rectX - rectW * 2)
            .attr("y", curY - rectW)
            .attr("width", rectW * 2)
            .attr("height", rectW * 2)
            .style('fill', "#FDFFB9")

        // add text

        // var labels = svg.append("g").attr("class", "end-bar-labels");

        labels.append("text")
            .attr("x", 10)
            .attr("y", +curY - labelOffset)
            .text("60% of youth employed")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            

        labels.append("text")
            .attr("x", +rectX + 20)
            .attr("y", +curY  - labelOffset)
            .text("40% of youth unemployed")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)

        }
        else { 
            d3.select(".label-holder").transition().duration(1000).style("opacity", 1);
        }
            
            
slideElevenDone = true;

    }

function slide_eleven_reverse () { 
    d3.select(".label-holder").transition().duration(1000).style("opacity", 0);

    d3.selectAll(".grade1")
        .transition()
        .duration(1000)
        .style("fill", "#31D5E8")
}

function slide_twelve() { 

    if(mobile) { 
        var rectW = 8;
        var rectOffset = 40;
        var labelOffset = 30 ;
        var circleY = 48;
     }
     else { 
        var rectW = 12;
        var rectOffset = 58;
        var labelOffset = 48;
        var circleY = 70;
     }


    if(!slideTwelveDone) {
    var prevR = d3.select(".grade1").attr("r"),
        prevY = d3.select(".grade1").attr("cy");
        c
        
       
        
        

    var endBarTwo = svg.append("g").attr("class", "end-bar-two");

    for(var c = 0; c < 100; c++) { 
        endBarTwo.append("circle")
            .attr("class", "circle2")
            .attr("cx", function () { 
                return c * (radius * 2) + spacing;
                
            })
            .attr("cy", +prevY + circleY)
            .attr("r", prevR)
            .style("fill", function () { 
                if(c < 87 ) { return "#FDFFB9"; }
                else { return "#31D5E8"; }

            })
          
    }

    // get rectX
    var rectX = d3.selectAll(".circle2:nth-child(86)").attr("cx");

    endBarTwo.append("rect")
        .attrs({
            "x": +rectX - rectW,
            "y": +prevY + rectOffset,
            "width": rectW * 2,
            "height": rectW * 2 })
            .style("fill", "#FDFFB9" )


    endBarTwo.append("text")
                .attr("x", 10)
                .attr("y", +prevY + labelOffset)
                .text("Graduates employed")
                .style("fill", "#fff")
                .style("font-size", "90%")
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                
        }
        else { 
            d3.select(".end-bar-two").transition().duration(1000).style("opacity", 1);
        }
        slideTwelveDone = true;
}

function slide_twelve_reverse ()  { 
    d3.select(".end-bar-two").transition().duration(1000).style("opacity", 0);

}

function slide_thirteen() { 

    if(mobile) { 
        var rectW = 8;
        var rectOffset = 86;
        var labelOffset = 78 ;
        var circleY = 94;
     }
     else { 
        var rectW = 12;
        var rectOffset = 128;
        var labelOffset = 115;
        var circleY = 140;
     }

    if(!slideThirteenDone) { 
    var prevR = d3.select(".grade1").attr("r"),
        prevY = d3.select(".grade1").attr("cy");
        
    var endBarTwo = svg.append("g").attr("class", "end-bar-three");

    for(var c = 0; c < 100; c++) { 
        endBarTwo.append("circle")
            .attr("class", "circle3")
            .attr("cx", function () { 
                return c * (radius * 2) + spacing;
                
            })
            .attr("cy", +prevY + circleY)
            .attr("r", prevR)
            .style("fill", function () { 
                if(c < 66 ) { return "#FDFFB9"; }
                else { return "#31D5E8"; }

            })
           
    }

    // rect
    var rectX = d3.select(".circle3:nth-child(65)").attr("cx");
    endBarTwo.append("rect")
        .attrs({
            width: rectW * 2,
            height: rectW * 2,
            x: +rectX - rectW,
            y: +prevY + rectOffset
        })
        .style("fill", "#FDFFB9")
        


    
    
            endBarTwo.append("text")
                .attr("x", 10)
                .attr("y", +prevY + labelOffset)
                .text("Matric certification employed")
                .style("fill", "#fff")
                .style("font-size", "90%")
                .style("opacity", 0)
                .transition()
                .duration(1000)
                .style("opacity", 1)

    }
    else { 

        d3.select(".end-bar-three").transition().duration(1000).style("opacity", 1);


    }

    slideThirteenDone = true;

}

function slide_thirteen_reverse () { 
    d3.select(".end-bar-three").transition().duration(1000).style("opacity", 0);
}

function slide_fourteen() { 

    if(mobile) { 
        var rectW = 8;
        var rectOffset = 132;
        var labelOffset = 125 ;
        var circleY = 140;
     }
     else { 
        var rectW = 12;
        var rectOffset = 128;
        var labelOffset = 185;
        var circleY = 210;
     }

    if(!slideFourteenDone) { 
    var prevR = d3.select(".grade1").attr("r"),
        prevY = d3.select(".grade1").attr("cy");
    
    var endBarTwo = svg.append("g").attr("class", "end-bar-four");

    for(var c = 0; c < 100; c++) { 
        endBarTwo.append("circle")
            .attr("class", "circle4")
            .attr("cx", function () { 
                return c * (radius * 2) + spacing;
                
            })
            .attr("cy", +prevY + circleY)
            .attr("r", prevR)
            .style("fill", function () { 
                if(c < 55 ) { return "#FDFFB9"; }
                else { return "#31D5E8"; }

            })
            
    }

    var rectX = d3.select(".circle4:nth-child(54)").attr("cx");
    endBarTwo.append("rect")
        .attrs({ 
            x: +rectX - rectW,
            y: +prevY + rectOffset,
            width: rectW * 2,
            height: rectW * 2
        })
        .style("fill", "#FDFFB9")


    // var labels = svg.append("g").attr("class", "end-bar-labels3");
    
        endBarTwo.append("text")
            .attr("x", 10)
            .attr("y", +prevY + labelOffset)
            .text("No matric certificate")
            .style("fill", "#fff")
            .style("font-size", "90%")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)

    }
    else { 

        d3.select(".end-bar-four").transition().duration(1000).style("opacity",1);


    }

    slideFourteenDone = true;

}

function slide_fourteen_reverse () { 
    
    d3.select(".end-bar-four").transition().duration(1000).style("opacity", 0)
}



    function addPercentLines (x, y, i) { 

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

function slide_fifteen () { 

    d3.select(".end-bar-two").transition().duration(500).style("opacity", 0);
    d3.select(".end-bar-three").transition().duration(500).style("opacity", 0);
    d3.select(".end-bar-four").transition().duration(500).style("opacity", 0);
    d3.selectAll(".grade1").transition().duration(500).style("opacity", 0);
    d3.select(".label-holder").transition().duration(500).style("opacity", 0);

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

    newCircles.startX = newCircles.curX = width/2 - (newCircles.cols / 2 * (newCircles.radius * 2 + newCircles.spacing));


    var oneHundred = svg.append("g").attr("class", "one-hundred");

    for(var c = 0; c < 100; c++) { 
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
            .delay( randomInt(50, 800))
            .style("opacity", 1)

        if(newCircles.col < newCircles.cols - 1) { 
            newCircles.col++; 
            newCircles.curX += (newCircles.radius * 2) + newCircles.spacing; }
        else { 
            newCircles.col = 0;
            newCircles.row++; 
            newCircles.curX = newCircles.startX; 
            newCircles.curY -= (newCircles.radius * 2) + newCircles.spacing; 
            }
       
    }



}

var block2x; 

function slide_sixteen () { 

    var curX = width / 2 - 50,
        curY = height - 30,
        col = 0,
        incr = newCircles.radius * 2 + newCircles.spacing;

    var curX2 = width / 2 + 50,
        curY2 = height - 30,
        col2 = 0;

    
    
    d3.selectAll(".the-hundred")
        .each( function (d, i) { 
            //  var color = d3.select(this).style("stroke");
            //  var curX = d3.select(this).attr("cx");
            //  var curY = d3.select(this).attr("cy");
             

             if(i < 50) { 
                 d3.select(this)
                    .attr("class", "block1")
                    .transition()
                    .delay(randomInt(50, 500))
                    .duration( 500)
                    .attr("cx", curX)
                    .attr("cy", curY)
                    .style("stroke", "lightsteelblue")

                    if(col < 7) { col++; curX -= incr; }
                    else { col = 0; curY -= incr; curX = width / 2 - 50; }
             }

             if(i > 49) { 
                d3.select(this)
                    .attr("class", "block2")
                   .transition()
                   .delay(randomInt(50, 500))
                   .duration( 500)
                   .attr("cx", curX2)
                   .attr("cy", curY2)
                   .style("stroke", "#FDFFB9")

                   if(col2 < 7) { col2++; curX2 += incr; }
                   else { col2 = 0; curY2 -= incr; curX2 = width / 2 + 50; }
            }
              
                // d3.select(this)
                //     .attr("class", function () { 
                //         if(i < 50 ) return "block2";
                //         else return "block1";
                //     })
                //     .transition()
                //     .delay( randomInt( 50, 500))
                //     .duration( function () { 
                //         return 400;
                //     }) 
                    
                //     .style("stroke", function ()  { 
                //         if(i < 50) return "#FDFFB9"; 
                //         else return "lightsteelblue";
                        
                //     })
                //     .attr("cx", function () { 
                //         if(i > 49) { 
                //             return (+curX - groupWidth / 2) - 20;
                //         }
                //         else { return (+curX + groupWidth / 2 ) + 20; }
                //     })
                //     .attr("cy", function () { 
                //         if(i > 49) { 
                            
                //             return +curY + yDiff;
                //         }
                //         else { return +curY; }
                //     })
                    
                    
            


        })


        // ADD LABELS BLOCK1
       setTimeout( function () {
      
        var pos = getBlockPoints(".block1");

        var labels = svg.append("g").attr("class", "l1");
        
        labels.append("text")
            .attr("x", pos.left - newCircles.radius)
            .attr("y", +pos.bottom + 30)
            .text("Failed to reach grade 12")
            .style("fill", "#fff")
            .style("stroke", "none")
            .style("text-anchor", "start")
            .style("text-transform", "uppercase")
            .style("font-size", "90%")
       


        }, 1000);

         // ADD LABELS BLOCK2
       setTimeout( function () {
   

    var pos = getBlockPoints(".block2");

    var labels = svg.append("g").attr("class", "l2");
    
    labels.append("text")
        .attr("class", "block2label")
        .attr("x", pos.left - newCircles.radius)
        .attr("y", +pos.bottom + 30 )
        .text("Started Grade 12")
        .style("fill", "#fff")
        .style("stroke", "none")
        .style("text-anchor", "start")
        .style("text-transform", "uppercase")
        .style("font-size", "90%")


    }, 1000);
        


        


}

function slide_seventeen () { 

    var pos = getBlockPoints(".block1");
    var col = 0; 
    var incr = newCircles.radius * 2 + newCircles.spacing;
    var curX = +pos.left; 
    var curY = +pos.top - 80;

    d3.selectAll(".block2")
        .each( function (d, i) { 
           


            if(i > 50 - 35 && i < 50) { 
                d3.select(this)
                    .attr("class", "block3")
                    .transition()
                    .delay( randomInt(50, 500))
                    .duration(500)
                    .attr("cx", curX)
                    .attr("cy", curY)
                    .style("stroke", "lightpink")

                    
                    

                    if(col < 7) { col++; curX += incr; }
                    else { col = 0; curX = +pos.left; curY -= incr; }

            }
               
            

        })

        // change label on block 2
        d3.select(".block2label").text("Failed grade 12")

        
       

        
        setTimeout( function () { 
            var pos = getBlockPoints(".block3");
            var posTarget = getBlockPoints(".block1");

            var labels = svg.append("g").attr("class", "l4");
            
            labels.append("text")
                .attr("x", posTarget.left - newCircles.radius)
                .attr("y", +pos.bottom + 30 )
                .text("Passed Grade 12")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "start")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")
        

        }, 1000)

}
function slide_eighteen () { 

    var points = getBlockPoints(".block3");
    var pointsTarget = getBlockPoints(".block2");


var col = 0,
    curX = +pointsTarget.left,
    curY = +points.bottom,
    incr = newCircles.radius * 2 + newCircles.spacing;
    
    d3.selectAll(".block3")
        .each( function (d, i) { 
            
            if(i > 21) { 
                d3.select(this)
                    .attr("class", "block4")
                    .transition()
                    .delay( randomInt(50,500))
                    .style("stroke", "lawngreen")
                    .attr("cx", curX)
                    .attr("cy", curY)
                   
                if(col < 7) { curX += incr; col++; }
                else { curX = +pointsTarget.left; curY -= incr; col = 0; }
            }

        })

        setTimeout( function () { 
            var pos = getBlockPoints(".block4"),
                posTarget = getBlockPoints(".block3");

            var labels = svg.append("g").attr("class", "l4");
            
            labels.append("text")
                .attr("x", pos.left - newCircles.radius)
                .attr("y", +pos.bottom + 30 )
                .text("University Pass")
                .style("fill", "#fff")
                .style("stroke", "none")
                .style("text-anchor", "start")
                .style("text-transform", "uppercase")
                .style("font-size", "90%")
        

        }, 1000)

}


function slide_nineteen () { 

    var nm = Math.floor(55 * (employment.noMatric/100));
    d3.selectAll(".block1")
        .each( function (d, i) { 
            if( i < nm) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("fill", "lightsteelblue")
                    // .style("stroke", "#000")
            }

        })

    var nm = Math.floor(55 * (16/100));
        d3.selectAll(".block2")
            .each( function (d, i) { 
                if( i < nm) {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("fill", "#FDFFB9")
                        // .style("stroke", "#000")
                }
    
            })

    var nm = Math.floor(22 * (employment.matric/100));

    d3.selectAll(".block3")
        .each( function (d, i) { 
            if( i < nm) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("fill", "lightpink")
                   
            }

        })

    var nm = Math.floor(12 * (employment.graduates/100));
 
    d3.selectAll(".block4")
        .each( function (d, i) { 
            if( i < nm) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("fill", "lawngreen")
              
            }

        })

}


function getBlockPoints (className) { 
    var top = 10000,
        bottom = 0,
        left = 10000,
        right = 0;

    d3.selectAll(className)
        .each( function (d, i) {
            var x = d3.select(this).attr("cx")
            if( x < left) left = x;
            if( x > right) right = x;
            
            var y = d3.select(this).attr("cy");
            if( y < top) top = y;
            if( y > bottom) bottom = y;
        });

       return { 
           top: top,
           bottom: bottom,
           left: left, 
           right: right
       } 

}



    $(window).on("beforeunload", function () {
       
        $(window).scrollTop(0);
        
    });

    $("document").ready( function () { 
        setTimeout( function () { 
            $(".loading").css("display", "none");
            $("html").css("overflow", "auto");
            scrollInit();
        },0);
    })

})();



