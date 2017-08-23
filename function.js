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
        .transition()
        .delay(500)
        .duration(1000)
        .style("opacity", 1)
    
}


//////// MAKE BARS 


var makeBars = function (className, pupilCount, labelName, year, labelClass, start, label, ref) { 
        if(!start) { xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2);  yPos = height - 30; } 
        
        else { xPos = 0;  }
        startXpos = xPos,
            colCount = 0;
    
   // barlabels
    svg.append("text")
        .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
        .attr("y", height - 5)
        .html(year)
        .attr("class", "barLabels")
        .style("text-anchor", "middle")
        .style("opacity", 0)
        .transition() 
        .delay(1000)
        .duration(1000)
        .style("opacity", 1)
    

           
    
    var c = d3.selectAll(".grade7").size();
    

    var col = "fffcbc";
    
    if(!ref) { 
    
    d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
//                .attr("cx", xPos + 50)
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
//                    return i * 1.5;
                })
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
                .style("fill", col)
                .style("opacity", 1)
                .style("stroke","none")
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
        

        
    }
    
    else { 
        
        d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
                .classed("diff", function () { 
                    if(i < c) return "false";
                    else return true;
                })
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
                })
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
                .style("fill", col)
                
                .style("opacity", function () { 
                    if(i < c) return 1;
                    else return 0; 
                })
                .style("fill", function () { 
                    if(i < c) return "#fffcbc";
                    else return "#85f2e0";
                })
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
        
    
    }
    
    
    
   
    
    
    //    barNumbers
    svg.append("text")
        .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
        .attr("y", function() { 
        
            if(ref) return yPos - 10 + 65;
            else return yPos - 10;
        })
        .html(pupilCount)
        .attr("class", "barNumbers")
        .style("text-anchor", "middle")
        .style("opacity", 0)
        .transition() 
        .delay(1000)
        .duration(1000)
        .style("opacity", 1)
            
    
    
        
            
        

            

    }