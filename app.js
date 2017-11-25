(function () {
    'use scrict';

    // for reverse
    var startPositions = [],
        slide4reverse = false,
        slide5reverse = false;

    // config
    var width = 880,
        height = 480,
        padding = 20,
        gradeBuckets = 2500,
        colCount = 0,
        rowCount = 0,
        colLimit = 10,
        xPos = 10,
        yPos = height - 30,
        radius = 2,
        spacing = 1.5,
        startXpos = xPos,
        labelXpos = startXpos,
        labels,
        slideOffset = window.innerHeight / 3,
        transition = 500;

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
        d3.selectAll(".grade1")
            .each(function (d, i) {
                d3.select(this)
                    .attr("cx", xx)
                    .attr("cy", yy)
                    .transition()
                    .delay(function () {
                        return randomInt(50, 500);
                    })
                    .style("opacity", 1);

                colc > 50 ? (xx = 200, yy += 9, colc = 0) : (xx += 8.7, colc++);

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
                    .duration(transition * 3)
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



    d3.csv("students.csv", function (data) {
        data.forEach(function (d) {
            d.pupils = +d.pupils / gradeBuckets;
        })

        addCircles(data[0].pupils, "grade1", "crimson");


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
        slideSixDone = false,
        slideSevenDone = false,
        slideEightDone = false;


    /////// WAYPOINTS

    $("document").ready(function () {

        var slide2 = new Waypoint({
            element: document.getElementById("slide-two"),
            handler: function (direction) {

                if (direction === "down" && !slideTwoDone) {
                    slideTwoDone = true;
                    spreadCircles();
                } else {
                    slideTwoDone = false;
                    spreadCirclesReverse();
                }
            },
            offset: slideOffset
        })

        var slide3 = new Waypoint({
            element: document.getElementById("slide-three"),
            handler: function (direction) {

                if (direction === "down" && !slideThreeDone) {
                    slideThreeDone = true;
                    slide_three();
                } else {
                    slideThreeDone = false;
                    slide_three_reverse();
                }

            },
            offset: slideOffset
        })



        var slide4 = new Waypoint({
            element: document.getElementById("slide-four"),
            handler: function (direction) {

                if (direction === "down" && !slideFourDone) {
                    slideFourDone = true;
                    slide_four();
                } else {
                    slideFourDone = false;
                    slide_four_reverse();
                }

            },
            offset: slideOffset
        })


        var slide5 = new Waypoint({
            element: document.getElementById("slide-five"),
            handler: function (direction) {

                if (direction === "down" && !slideFiveDone) {
                    slideFiveDone = true;
                    slide_five();
                } else {
                    slideFiveDone = false;
                    slide_five_reverse();
                }

            },
            offset: slideOffset
        })


        var slide6 = new Waypoint({
            element: document.getElementById("slide-six"),
            handler: function (direction) {

                if (direction === "down" && !slideSixDone) {
                    slideSixDone = true;
                    slide_six();
                } else {
                    slideSixDone = false;
                    slide_six_reverse();
                }

            },
            offset: slideOffset
        })



        var slide7 = new Waypoint({
            element: document.getElementById("slide-seven"),
            handler: function (direction) {

                if (direction === "down" && !slideSevenDone) {
                    slideSevenDone = true;
                    slide_seven();
                } else {
                    slideSevenDone = false;
                    slide_seven_reverse();
                }

            },
            offset: slideOffset
        })



        var slide8 = new Waypoint({
            element: document.getElementById("slide-eight"),
            handler: function (direction) {

                if (direction === "down" && !slideEightDone) {
                    slideEightDone = true;
                    slide_eight();
                } else {
                    slideEightDone = false;
                    slide_eight_reverse();
                }

            },
            offset: slideOffset
        })



    }); // document ready


    // slide functions

    function slide_three() {
        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width - 100)
            .attr("y1", height - 28)
            .attr("y2", height - 28)
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

        svg.selectAll(".grade2group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade3group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade4group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade5group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade6group").transition().duration(transition * 3).style("opacity", 0);
        svg.selectAll(".grade7group").transition().duration(transition * 3).style("opacity", 0);


        slide4reverse = true;
    }


    function slide_five() {
        if (slide5reverse) {
            svg.selectAll(".grade8group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade9group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade10group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade11group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
            svg.selectAll(".grade12group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 1);
        } else {
            makeBars("bar8", ".grade8", "barNo8", "934,588", "Gr8 (2012)", ".label7", false)
            makeBars("bar9", ".grade9", "barNo9", "1,036,555", "Gr9 (2013)", ".label9", false)
            makeBars("bar10", ".grade10", "barNo10", "1,100,877", "Gr10 (2014)", ".label8", false)
            makeBars("bar11", ".grade11", "barNo11", "890,971", "Gr11 (2015)", ".label11", false)
            makeBars("bar12", ".grade12", "barNo2", "665,355", "Gr12 (2016)", ".label12", false, true)
            makeBars("bar13", ".grade13", "barNo13", "442,672", "", ".label13", false)
            makeBars("bar14", ".grade14", "barNo14", "162,374", "", ".label14", false)
        }

    }

    function slide_five_reverse() {
        svg.selectAll(".grade8group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade9group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade10group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade11group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);
        svg.selectAll(".grade12group").transition().delay( randomInt(5, 500)).duration(transition).style("opacity", 0);

        slide5reverse = true;
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
        d3.selectAll(".grade12")
            .each(function (d, i) {
                var curX = d3.select(this).attr("cx");
                d3.select(this).transition().delay(function (d, i) {
                        return randomInt(200, 1000);
                    })
                    .duration(transition).attr("cx", curX - xDiff)

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

                newX = newX + spacing + radius * 2;
                colCount++;

                if (colCount === colLimit) {
                    newX = newStartX;
                    colCount = 0;
                    newY = newY - spacing - radius * 2;
                }

            })

        // move bar Numebrs
        d3.select(".barNumbersOne").transition().duration(transition).attr("x", startPositions[0]).style("text-anchor", "start");
        d3.select(".barNumbersTwo").transition().duration(transition).attr("x", startPositions[11]).style("text-anchor", "start");

        d3.selectAll(".barremove").style("opacity", 1);
        for (var x = 2; x < 12; x++) {
            svg.selectAll(".grade" + x).transition().delay(500).duration(transition).style("opacity", 1);
        }

    }


    function slide_seven() {



        var getStartX = d3.select(".grade12").attr("cx");
        var curX = d3.select(".grade13").attr("cx");
        var startXdiff = curX - getStartX;
        var xDiff = curX - getStartX - (radius * 2 + spacing) * (colLimit + 2);
        // var newLabelX = getStartX + (radius * 2 + spacing) * (colLimit + 2);

        d3.selectAll(".grade13")

            .each(function (d, i) {
                var curX = d3.select(this).attr("cx");
                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 1)
                    .attr("cx", curX - xDiff)
            })

        moveBarNumber(".barNo13", xDiff);


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


    }



    function slide_eight() {


        var getStartX = d3.select(".grade13").attr("cx");
        var curX = d3.select(".grade14").attr("cx");
        var xDiff = curX - getStartX - (radius * 2 + spacing) * (colLimit + 2);
        //get diff

        d3.selectAll(".grade14")

            .each(function (d, i) {

                var curX = d3.select(this).attr("cx");
                d3.select(this)
                    .transition()
                    .delay(randomInt(5, 500))
                    .duration(transition)
                    .style("opacity", 1)
                    .attr("cx", curX - xDiff)

            })

        moveBarNumber(".barNo14", xDiff);


    }

    function slide_eight_reverse() {
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

    }







    $(window).on("beforeunload", function () {
        $(window).scrollTop(0);
    });



})();