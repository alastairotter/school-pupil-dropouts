 var addCircles = function (gradeCount, className) { 
    console.log(className + " : " + Math.floor(gradeCount));

    for(var c = 0; c < gradeCount; c++) {

        svg.append("circle")
            .attr("cx", 50)
            .attr("cy", yPos)
            .attr("r", 2)
            .attr("class", className)
            .style("opacity", 0)
        }

}


////////////// SPREAD CIRCLES 

var spreadCircles = function () { 
        var newX = 0, 
            newY = height - 10,
            newColCount = 0,
            newRowCount = 0,
            newColCountLimit = 100,
            newRadius = 1.5,
            newSpacing = 2;
        
    var xx = 0, yy = height/4*3, colc = 0;
    
    d3.selectAll(".grade1")
        .each( function (d, i) { 
            d3.select(this).attr("cx", xx).attr("cy", yy).attr("r", 3).style("fill", "#fffcbc").style("opacity", 0)
                if(colc > 100) { xx = 0; yy = yy + 9; colc = 0; } 
                else { xx = xx + 8.7; colc++; }
        
        })
        
    
}

var spreadCirclesReverse = function () { 
    var newX = 0, 
        newY = height - 10,
        newColCount = 0,
        newRowCount = 0,
        newColCountLimit = 100,
        newRadius = 1.5,
        newSpacing = 2;
    
var xx = 0, yy = height/4*3, colc = 0;

d3.selectAll(".grade1")
    .each( function (d, i) { 
        d3.select(this).transition()
            .delay( function () { return randomInt(50, 200); })
            .duration( function () { return randomInt(100, 500); })
            .attr("cx", xx).attr("cy", yy).attr("r", 3).style("fill", "#fffcbc").style("opacity", 1)
            if(colc > 100) { xx = 0; yy = yy + 9; colc = 0; } 
            else { xx = xx + 8.7; colc++; }
    
    })
    

}


//////// MAKE BARS 


var makeBars = function (groupName, className, barNo, pupilCount, year, labelClass, start, label, ref) { 
       
    
    if(!start) { xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2);  yPos = height - 30; } 
        
        else { xPos = 0;  yPos = height - 30; }
        startXpos = xPos,
            colCount = 0;
    
    
    
    
   
    var bar = svg.append("g")
        .attr("class", "." + groupName);
    
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
        .duration(1000)
        .style("opacity", function () { 
            if(groupName === "bar13" || groupName === "bar14") { return 0; }
            else { return 1; }
        })
    

           
    
//    var c = d3.selectAll(".grade7").size();
    

    var col = "fffcbc";
    
    
    
    d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
                })
                
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
                .style("fill", function () { 
                    if(className === ".grade13") { return "white"; }
                    else if(className === ".grade14") { return "white"; }
                    else { return col; }
                })
                .style("opacity", function () { 
                    if(groupName === "bar13" || groupName === "bar14") { return 0; }
                    else { return 1; }
                })
                .style("stroke","none")
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
        

        
    
    

    
    
    
   
    console.log(barNo)
    
    //    barNumbers
    bar.append("text")
        .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
        .attr("y", function() { 
        
            if(ref) return yPos - 10 + 65;
            else return yPos - 10;
        })
        .html(pupilCount)
        .attr("class", "barNumbers")
        .classed(barNo, true )
//        .classed("barNumbers", true)
        .style("text-anchor", "middle")
        .style("opacity", 0)
        .transition() 
        .delay(1000)
        .duration(1000)
        .style("opacity", function () { 
            if(groupName === "bar13" || groupName === "bar14") { return 0; }
            else { return 1; }
        })
            
    
    
        
            
        

            

    }



function moveBarNumber (barNo, xDiff) { 
    
    d3.select(barNo)
            .transition()
            .duration(1000)
            .attr("x", function () { 
                var cX = d3.select(this).attr("x");
                return cX - xDiff; 
             
            })
            .style("opacity", 1)
    
}